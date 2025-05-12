import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getCreatorSubscriptionDoc, getStripeDoc } from "../../services/stripe";
import { checkUserSubscribeToCreator } from "../../services/subscription";
import { getUserByUsername } from "../../services/users";

export const getCreatorSubscriptionInfo = onCall(
  corsOptions,
  async (request) => {
    try {
      const uid = request.auth?.uid || "";
      const creatorUsername = request.data.creatorUsername;

      if (!creatorUsername)
        throw new HttpsError(
          "invalid-argument",
          "Educator username is required"
        );

      const creatorData = await getUserByUsername(creatorUsername);

      if (!creatorData) throw new HttpsError("not-found", "Educator not found");

      const creatorId = creatorData.id;

      const creatorSubscriptionData =
        await getCreatorSubscriptionDoc(creatorId);
      const subscriptionPrice = creatorSubscriptionData?.subscriptionPrice;

      const creatorStripeDoc = await getStripeDoc(creatorId);
      const isSubscriptionActivated =
        creatorStripeDoc?.charges_enabled && creatorStripeDoc?.payouts_enabled;

      // Check if the user is viewing their own subscription info
      const isOwnProfile = uid === creatorId;

      let isSubscribed = isOwnProfile;
      let cancelAtPeriodEnd = false;
      let isPastDue = false;
      if (!isOwnProfile) {
        const check = await checkUserSubscribeToCreator(creatorId, uid);
        isSubscribed = check.isSubscribed;
        isPastDue = check.isPastDue;
        cancelAtPeriodEnd = check.subscriber?.cancelAtPeriodEnd || false;
      }

      return {
        subscriptionPrice,
        isSubscriptionActivated,
        isSubscribed,
        cancelAtPeriodEnd,
        isOwnProfile,
        isPastDue,
        isCreatorAccountDeleted: Boolean(creatorStripeDoc?.deletedAt),
      };
    } catch (error) {
      logError(error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError(
        "internal",
        "Failed to get creator subscription info"
      );
    }
  }
);
