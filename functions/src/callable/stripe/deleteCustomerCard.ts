import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { firestore } from "../../services/firebaseAdmin";
import { logError } from "../../services/logging";
import {
  checkIfPaymentMethodBelongsToUser,
  deattachPaymentMethodFromCustomer,
} from "../../services/stripeCustomers";

export const deleteCustomerCard = onCall(corsOptions, async (request) => {
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
    const stripeUserDoc = await firestore
      .doc(`stripe_users/${userId}`)
      .get()
      .then((doc) => (doc.exists ? doc.data() : null));

    if (!stripeUserDoc?.stripeCustomerId) {
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
    // Check if payment method is active
    if (paymentMethod.isActive) {
      throw new HttpsError(
        "failed-precondition",
        "Active payment method cannot be deleted."
      );
    }

    // Detach payment method
    const detachedPaymentMethod =
      await deattachPaymentMethodFromCustomer(paymentMethodId);

    // Delete the payment method from the user's document
    await firestore
      .doc(`stripe_users/${userId}`)
      .collection("payment_methods")
      .doc(paymentMethodId)
      .delete();

    return { paymentMethodId: detachedPaymentMethod.id };
  } catch (error) {
    logError(error, { userId, paymentMethodId });
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to delete card.");
  }
});
