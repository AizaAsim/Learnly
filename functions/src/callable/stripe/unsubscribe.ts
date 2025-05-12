import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getStripeDoc } from "../../services/stripe";
import {
  cancelSubscriptionAtPeriodEnd,
  checkUserSubscribeToCreator,
} from "../../services/subscription";

export const unsubscribe = onCall(corsOptions, async (request) => {
  try {
    const { uid: userId } = request.auth || {};
    const creatorId = request.data.creatorId;

    if (!userId) {
      throw new HttpsError("unauthenticated", "User is not authenticated.");
    }

    if (!creatorId) {
      throw new HttpsError("invalid-argument", "Educator ID is required.");
    }

    const { isSubscribed, subscriber } = await checkUserSubscribeToCreator(
      creatorId,
      userId
    );

    if (!isSubscribed || !subscriber)
      throw new HttpsError("failed-precondition", "User is not subscribed.");

    const { status, cancelAtPeriodEnd, latestSubscriptionId } = subscriber;

    // Check if subscription is already cancelled
    if (status === "canceled") {
      throw new HttpsError(
        "failed-precondition",
        "User is already unsubscribed."
      );
    }
    // Check if subscription is alrady set to cancel at the end of the billing period
    if (cancelAtPeriodEnd)
      throw new HttpsError(
        "failed-precondition",
        "Subscription is already set to cancel at the end of the billing period."
      );

    const { stripeConnectId } = (await getStripeDoc(creatorId)) || {};
    if (!stripeConnectId)
      throw new HttpsError(
        "failed-precondition",
        "Educator does not have a Stripe account set."
      );

    const subscription = await cancelSubscriptionAtPeriodEnd(
      latestSubscriptionId,
      stripeConnectId
    );

    return { subscriptionId: subscription.id };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create Subscription.");
  }
});
