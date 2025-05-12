import Stripe from "stripe";
import { logError, logInfo, logWarning } from "../../services/logging";
import {
  InAppNotificationIconType,
  InAppNotificationType,
} from "../../types/pubsub";
import { sendNotification } from "../../services/notifications";
import { firestore } from "../../services/firebaseAdmin";
import { deattachPaymentMethodFromCustomer } from "../../services/stripeCustomers";
import {
  ConnectedPaymentMethod,
  StripeCustomer,
} from "../../types/subscription";

export async function handlePaymentMethodAttached(
  event: Stripe.PaymentMethodAttachedEvent
) {
  logInfo(event);
  const paymentMethod = event.data.object;
  const uid = paymentMethod.metadata?.firestoreUid;
  if (!uid) {
    throw new Error("No UID found in payment method metadata");
  }

  const notificationData = {
    title: `•••• ${paymentMethod.card?.last4}`,
    type: InAppNotificationType.USER_PAYMENT_METHOD_UPDATE,
    iconType: InAppNotificationIconType.STATIC,
    message: "New card is attached.",
  };

  await sendNotification({
    to: uid,
    data: notificationData,
  });
}

export async function handlePaymentMethodDetached(
  event: Stripe.PaymentMethodDetachedEvent
) {
  logInfo(event);
  const paymentMethod = event.data.object;
  const uid = paymentMethod.metadata?.firestoreUid;

  if (!uid) {
    throw new Error(
      `No UID found in payment method metadata for event ${event.id}`
    );
  }

  // Get the nested stripe_customers collection for the user
  const stripeCustomersRef = firestore.collection(
    `stripe_users/${uid}/stripe_customers`
  );
  const stripeCustomersSnapshot = await stripeCustomersRef.get();

  // Process all customers in parallel
  const deattachmentPromises = stripeCustomersSnapshot.docs.map(
    async (customerDoc) => {
      try {
        const customerData = customerDoc.data() as StripeCustomer;
        // Fetch the connected customer's payment method
        const connectedPaymentMethodRef = firestore.collection(
          `stripe_users/${uid}/connected_payment_methods`
        );
        const snapshot = await connectedPaymentMethodRef
          .where("platformPaymentMethodId", "==", paymentMethod.id)
          .where("creatorConnectId", "==", customerData.creatorConnectId)
          .get();
        if (snapshot.empty) {
          logWarning("No connected payment method found", {
            uid,
            paymentMethodId: paymentMethod.id,
          });
          return;
        }
        const connectedPaymentMethod =
          snapshot.docs[0].data() as ConnectedPaymentMethod;

        await deattachPaymentMethodFromCustomer(
          connectedPaymentMethod.connectPaymentMethod,
          customerData.creatorConnectId
        );

        // delete the connected payment method
        await snapshot.docs[0].ref.delete();

        logInfo("Successfully deattached payment method", {
          connectedPaymentMethod,
        });
      } catch (error) {
        logError("Failed to deattach payment method for customer");
        // Don't throw here to allow other customers to be processed
      }
    }
  );

  // Wait for all deattachments to complete
  await Promise.all(deattachmentPromises);

  // Send a notification to the user
  const notificationData = {
    title: paymentMethod.card?.last4
      ? `•••• ${paymentMethod.card.last4}`
      : "Payment Method",
    type: InAppNotificationType.USER_PAYMENT_METHOD_UPDATE,
    iconType: InAppNotificationIconType.STATIC,
    message: "Card is removed.",
  };

  await sendNotification({
    to: uid,
    data: notificationData,
  });
}
