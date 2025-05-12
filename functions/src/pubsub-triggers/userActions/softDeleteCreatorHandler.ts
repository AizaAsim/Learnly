import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../../services/firebaseAdmin";
import { logError, logInfo } from "../../services/logging";
import { getStripeDoc } from "../../services/stripe";
import { cancelSubscriptionAtPeriodEnd } from "../../services/subscription";
import { UserActionData } from "../../types/pubsub";

export const softDeleteCreatorHandler = async ({ userId }: UserActionData) => {
  try {
    const deletedAtTimestamp = Timestamp.fromMillis(Date.now());

    // Cancel all subscriptiosn at period end
    const subscribersSnapshot = await firestore
      .collection("learners")
      .where("creatorId", "==", userId)
      .get();

    // Use Promise.all to handle multiple async operations
    const cancelPromises = subscribersSnapshot.docs.map(async (doc) => {
      const subscriber = doc.data();
      if (["active", "trialing"].includes(subscriber.status)) {
        const subscriptionId = subscriber.latestSubscriptionId;
        const stripeDoc = await getStripeDoc(userId);
        if (stripeDoc) {
          await cancelSubscriptionAtPeriodEnd(
            subscriptionId,
            stripeDoc.stripeConnectId
          );
        }
      }
    });

    // Wait for all cancelation operations to complete
    await Promise.all(cancelPromises);

    const batch = firestore.batch();

    // Update user document
    batch.update(firestore.doc(`users/${userId}`), {
      deletedAt: deletedAtTimestamp,
    });

    // Update stripe document
    batch.update(firestore.doc(`stripe/${userId}`), {
      deletedAt: deletedAtTimestamp,
    });

    // Update reels documents
    const reelsSnapshot = await firestore
      .collection("reels")
      .where("creatorId", "==", userId)
      .get();

    reelsSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { deletedAt: deletedAtTimestamp });
    });

    // Update creators_subscriptions documents
    const subscriptionsSnapshot = await firestore
      .collection("creators_subscriptions")
      .where("creatorUid", "==", userId)
      .get();

    subscriptionsSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { deletedAt: deletedAtTimestamp });
    });

    // Commit the batch
    await batch.commit();

    logInfo(`Soft deleted creator ${userId}`);
  } catch (error) {
    logError("Failed to soft delete creator", error);
  }
};
