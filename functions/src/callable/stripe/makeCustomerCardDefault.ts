import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { firestore } from "../../services/firebaseAdmin";
import { logError } from "../../services/logging";
import {
  changeCustomerDefaultPaymentMethod,
  checkIfPaymentMethodBelongsToUser,
} from "../../services/stripeCustomers";
import {
  ConnectedPaymentMethod,
  StripeCustomer,
} from "../../types/subscription";

export const makeCustomerCardDefault = onCall(corsOptions, async (request) => {
  const userId = request.auth?.uid;
  const paymentMethodId = request.data?.paymentMethodId;

  if (!userId) {
    throw new HttpsError("unauthenticated", "User is not authenticated.");
  }

  if (!paymentMethodId) {
    throw new HttpsError("invalid-argument", "No payment method ID provided.");
  }

  try {
    // Fetch stripe user document
    const stripeUserDocRef = firestore.doc(`stripe_users/${userId}`);
    const stripeUserDoc = await stripeUserDocRef
      .get()
      .then((doc) => (doc.exists ? doc.data() : null));
    const platformCustomerId = stripeUserDoc?.stripeCustomerId;
    if (!platformCustomerId) {
      throw new HttpsError(
        "failed-precondition",
        "User does not have a valid Stripe customer."
      );
    }

    // Check if payment method belongs to user
    const { isBelongToUser, paymentMethod } =
      await checkIfPaymentMethodBelongsToUser(userId, paymentMethodId);
    if (!isBelongToUser || !paymentMethod) {
      throw new HttpsError(
        "failed-precondition",
        "Payment method does not belong to user."
      );
    }
    // Check if payment method is already active
    if (paymentMethod.isActive) {
      throw new HttpsError(
        "failed-precondition",
        "Payment method is already active."
      );
    }

    // Change the default payment method in the platform account
    const detachedPaymentMethod = await changeCustomerDefaultPaymentMethod(
      platformCustomerId,
      paymentMethodId
    );

    // Update the stripe_users document with the new active payment method
    await stripeUserDocRef.update({ activePaymentMethodId: paymentMethodId });

    const paymentMethodsRef = stripeUserDocRef.collection("payment_methods");
    // Update the previous active payment method to be inactive
    const paymentMethodsSnapshot = await paymentMethodsRef
      .where("isActive", "==", true)
      .get();
    for (const doc of paymentMethodsSnapshot.docs) {
      await doc.ref.update({ isActive: false });
    }
    // Update the payment_methods document to set the new active payment method
    await paymentMethodsRef.doc(paymentMethodId).update({
      isActive: true,
    });

    // Change the default payment method in connected accounts
    const connectedCustomersRef = await stripeUserDocRef
      .collection("stripe_customers")
      .get();
    for (const doc of connectedCustomersRef.docs) {
      const customer = doc.data() as StripeCustomer;
      const customerId = customer.stripeCustomerId;
      const creatorConnectId = customer.creatorConnectId;

      // Find the corresponding connected payment method
      const connectedPaymentMethodSnapshot = await stripeUserDocRef
        .collection("connected_payment_methods")
        .where("creatorConnectId", "==", creatorConnectId)
        .where("platformPaymentMethodId", "==", paymentMethodId)
        .get();
      if (connectedPaymentMethodSnapshot.empty) {
        throw new HttpsError(
          "failed-precondition",
          "Connected payment method not found."
        );
      }
      const connectedPaymentMethod =
        connectedPaymentMethodSnapshot.docs[0].data() as ConnectedPaymentMethod;

      await changeCustomerDefaultPaymentMethod(
        customerId,
        connectedPaymentMethod.connectPaymentMethod,
        creatorConnectId
      );
    }

    return { paymentMethodId: detachedPaymentMethod.id };
  } catch (error) {
    logError(error, { userId, paymentMethodId });
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to make card default.");
  }
});
