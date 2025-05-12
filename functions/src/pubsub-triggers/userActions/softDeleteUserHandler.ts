import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../../services/firebaseAdmin";
import { logError, logInfo } from "../../services/logging";
import { UserActionData } from "../../types/pubsub";
import { getStripeDoc } from "../../services/stripe";
import { cancelSubscription } from "../../services/subscription";

export const softDeleteUserHandler = async ({ userId }: UserActionData) => {
  try {
    const deletedAtTimestamp = Timestamp.fromMillis(Date.now());

    // Cancel all subscriptions
    const subscriptionsSnapshot = await firestore
      .collection("learners")
      .where("subscriberId", "==", userId)
      .get();

    // Use Promise.all to handle multiple async operations
    const cancelPromises = subscriptionsSnapshot.docs.map(async (doc) => {
      const subscription = doc.data();
      if (["active", "trialing"].includes(subscription.status)) {
        const subscriptionId = subscription.latestSubscriptionId;
        const creatorId = subscription.creatorId;
        const stripeDoc = await getStripeDoc(creatorId);
        if (stripeDoc) {
          await cancelSubscription(subscriptionId, stripeDoc.stripeConnectId);
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

    // Update stripe_users document
    batch.update(firestore.doc(`stripe_users/${userId}`), {
      deletedAt: deletedAtTimestamp,
    });

    // Update learners documents
    const subscribersSnapshot = await firestore
      .collection("learners")
      .where("subscriberId", "==", userId)
      .get();

    subscribersSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { deletedAt: deletedAtTimestamp });
    });

    // Commit the batch
    await batch.commit();

    logInfo(`Soft deleted user ${userId}`);
  } catch (error) {
    logError("Failed to soft delete user", error);
  }
};
