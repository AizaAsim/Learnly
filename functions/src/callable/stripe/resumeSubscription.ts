import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getStripeDoc } from "../../services/stripe";
import {
  getSubscriber,
  reActivateSubscription,
} from "../../services/subscription";

export const resumeSubscription = onCall(corsOptions, async (request) => {
  try {
    const userId = request.auth?.uid;
    if (!userId) {
      throw new HttpsError("unauthenticated", "User is not authenticated.");
    }
    const creatorId = request.data.creatorId;
    if (!creatorId) {
      throw new HttpsError("invalid-argument", "Educator ID is required.");
    }
    const stripeDoc = await getStripeDoc(creatorId);

    if (!stripeDoc) {
      throw new HttpsError(
        "failed-precondition",
        "Educator does not have a Stripe account set."
      );
    }
    if (stripeDoc.deletedAt) {
      throw new HttpsError(
        "failed-precondition",
        "Educator's Stripe account has been deleted."
      );
    }
    // Get the learners collection document for creator and user
    const subscriber = await getSubscriber(creatorId, userId);

    if (!subscriber) {
      throw new HttpsError("not-found", "Subscription not found.");
    }

    if (!["active", "trialing"].includes(subscriber.status)) {
      throw new HttpsError(
        "already-exists",
        "Subscription must be active to reactivate"
      );
    }

    if (!subscriber.cancelAtPeriodEnd) {
      throw new HttpsError(
        "failed-precondition",
        "Subscription is not scheduled for cancellation"
      );
    }
    const subscriptionId = subscriber.latestSubscriptionId;
    const subscription = await reActivateSubscription(
      subscriptionId,
      stripeDoc.stripeConnectId
    );
    return { subscriptionId: subscription.id };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to resume subscription.");
  }
});
