import Stripe from "stripe";
import { firestore } from "../../services/firebaseAdmin";
import { logError, logInfo } from "../../services/logging";
import { getPaymentMethod } from "../../services/stripe";
import {
  changeCustomerDefaultPaymentMethod,
  checkExistingConnectedPaymentMethod,
  savePlatformPaymentMethod,
  setupCustomerPaymentMethodInConnectedAccount,
} from "../../services/stripeCustomers";

export const handleSetupIntentSucceeded = async (
  event: Stripe.SetupIntentSucceededEvent
) => {
  const setupIntent = event.data.object;
  const uid = setupIntent.metadata?.firestoreUid;

  if (!uid) {
    throw new Error("No user id in metadata");
  }

  const paymentMethodId = setupIntent.payment_method;
  if (typeof paymentMethodId !== "string") {
    throw new Error("No payment method found in setup intent");
  }

  const paymentMethod = await getPaymentMethod(paymentMethodId);
  if (!paymentMethod || paymentMethod.type !== "card") {
    throw new Error("Invalid or unsupported payment method type");
  }

  // Change the default payment method for the customer in the platform account
  const customerId = paymentMethod.customer as string;
  await changeCustomerDefaultPaymentMethod(customerId, paymentMethodId);

  await savePlatformPaymentMethod(uid, paymentMethod, paymentMethodId);

  const stripeUserDocRef = firestore.collection("stripe_users").doc(uid);
  // Mark previous payment methods as inactive
  const paymentMethodsRef = stripeUserDocRef.collection("payment_methods");
  const paymentMethodsSnapshot = await paymentMethodsRef.get();
  for (const doc of paymentMethodsSnapshot.docs) {
    if (doc.id !== paymentMethodId) {
      await doc.ref.update({ isActive: false });
    }
  }

  // Update the main stripe_users document with the new active payment method
  await stripeUserDocRef.set(
    { activePaymentMethodId: paymentMethodId },
    { merge: true }
  );

  const stripeUserDocSnapshot = await stripeUserDocRef.get();
  if (!stripeUserDocSnapshot.exists) {
    throw new Error("User does not have a document in stripe_users.");
  }

  const stripeUserDoc = stripeUserDocSnapshot.data();
  const stripeCustomerId = stripeUserDoc?.stripeCustomerId;
  if (!stripeCustomerId) {
    throw new Error("User does not have a Stripe customer.");
  }

  const customersRef = await stripeUserDocRef
    .collection("stripe_customers")
    .get();

  // Clone and attach the new payment method to connected accounts
  for (const doc of customersRef.docs) {
    const customer = doc.data();
    const customerId = customer.stripeCustomerId;
    const creatorConnectId = customer.creatorConnectId;

    try {
      // Check if payment method already exists for this creator
      const existingPaymentMethod = await checkExistingConnectedPaymentMethod(
        uid,
        creatorConnectId,
        paymentMethodId
      );

      if (!existingPaymentMethod) {
        // Only create new payment method if it doesn't exist
        const connectPaymentMethod =
          await setupCustomerPaymentMethodInConnectedAccount(
            paymentMethodId,
            stripeCustomerId,
            creatorConnectId,
            uid,
            customerId,
            doc.id
          );
        logInfo(
          `Payment method ${connectPaymentMethod.id} cloned, attached and made default in ${creatorConnectId} for user ${uid}.`
        );
      }
    } catch (error) {
      logError(
        `Error updating payment method in ${creatorConnectId} for user ${uid}:`,
        error
      );
    }
  }
};
