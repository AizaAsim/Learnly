import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logCreatorEvent } from "../../services/creatorLogging";
import { logError } from "../../services/logging";
import { calculateProratedRefund, createRefund } from "../../services/refund";
import { getTotaltAvailableBalance, getStripeDoc } from "../../services/stripe";
import { cancelSubscription, getSubscriber } from "../../services/subscription";
import { blockUser, getUser, isUserBlocked } from "../../services/users";
import { CreatorLogType } from "../../types/creatorLogging";
import { firestore } from "../../services/firebaseAdmin";
import { sendNotification } from "../../services/notifications";
import {
  InAppNotificationIconType,
  InAppNotificationType,
} from "../../types/pubsub";

export const block = onCall(corsOptions, async (request) => {
  try {
    const creatorId = request.auth?.uid;
    if (!creatorId) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }
    const { userId } = request.data;
    const isAlreadyBlocked = await isUserBlocked(creatorId, userId);

    if (isAlreadyBlocked)
      throw new HttpsError("already-exists", "User is already blocked");

    const subscriber = await getSubscriber(creatorId, userId);

    const isSubscribed =
      subscriber && ["active", "trialing"].includes(subscriber.status);

    let refund;
    if (isSubscribed) {
      const refundAmount = calculateProratedRefund(
        subscriber.amount,
        subscriber.currentPeriodStart,
        subscriber.currentPeriodEnd
      );

      const creatorStripeDoc = await getStripeDoc(creatorId);

      if (!creatorStripeDoc || creatorStripeDoc.deletedAt) {
        throw new HttpsError("internal", "Educator has no stripe account");
      }

      const creatorConnectId = creatorStripeDoc.stripeConnectId;

      const availableBalance =
        await getTotaltAvailableBalance(creatorConnectId);

      if (availableBalance < refundAmount) {
        throw new HttpsError(
          "failed-precondition",
          `You have insufficient balance to refund $${refundAmount / 100}`
        );
      }

      refund = await createRefund(
        subscriber.latestCharge,
        refundAmount,
        creatorConnectId
      );

      await cancelSubscription(
        subscriber.latestSubscriptionId,
        creatorConnectId
      );

      await firestore
        .collection("learners")
        .doc(subscriber.id)
        .update({ cancellationReason: "CREATOR_BLOCKED" });
    }

    await blockUser(creatorId, userId);

    await logCreatorEvent({
      type: CreatorLogType.BLOCK_USER,
      creatorId,
      data: { userId },
    });

    const creator = await getUser(userId);

    if (!creator) throw new HttpsError("not-found", "User not found");

    await sendNotification({
      to: userId,
      data: {
        title: creator.displayName || creator.username || "Educator",
        message: "Blocked you.",
        type: InAppNotificationType.USER_BLOCKED,
        iconType: InAppNotificationIconType.STORAGE,
        iconStorageUrl: creator.avatar_url,
        metadata: {
          userId,
          creatorId,
          creatorUsername: creator.username,
        },
      },
    });

    return { blocked: true, refundAmount: refund?.amount || 0 };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to block user");
  }
});
