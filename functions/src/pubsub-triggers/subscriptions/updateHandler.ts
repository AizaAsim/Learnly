import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "../../services/firebaseAdmin";
import { logError, logInfo } from "../../services/logging";
import { convertUnixToFirestoreTimestamp } from "../../shared/helpers/utils";
import {
  EmailDynamicDataType,
  EmailType,
  InAppNotificationIconType,
  InAppNotificationType,
  SubscriptionData,
} from "../../types/pubsub";
import { addFreeTrialToResetBillingPeriod } from "../../services/subscription";
import { UserSubscription } from "../../types/subscription";
import { getUser } from "../../services/users";
import { sendNotification } from "../../services/notifications";
import { sendEmail } from "../../services/sendgrid";
import { format } from "date-fns";

export const updateHandler = async ({
  subscription,
  account,
}: SubscriptionData) => {
  const { creatorUid, subscriberUid } = subscription.metadata;
  try {
    const subscriptionData = {
      status: subscription.status,
      id: subscription.id,
      creatorUid,
      subscriberUid,
      amount: subscription.items.data[0].price.unit_amount,
      startDate: convertUnixToFirestoreTimestamp(subscription.start_date),
      currentPeriodEnd: convertUnixToFirestoreTimestamp(
        subscription.current_period_end
      ),
      currentPeriodStart: convertUnixToFirestoreTimestamp(
        subscription.current_period_start
      ),
      cancelAt: subscription.cancel_at
        ? convertUnixToFirestoreTimestamp(subscription.cancel_at)
        : null,
      cancelledAt: subscription.canceled_at
        ? convertUnixToFirestoreTimestamp(subscription.canceled_at)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
    const userSubscriptionRef = firestore
      .collection("users_subscriptions")
      .doc(subscription.id);
    const userSubscriptionSnapshot = await userSubscriptionRef.get();
    const userSubscriptionData =
      userSubscriptionSnapshot.data() as UserSubscription | null;
    await userSubscriptionRef.set(subscriptionData, { merge: true });

    // Update the subscriber document
    const subscriberRef = firestore
      .collection("learners")
      .doc(`${creatorUid}_${subscriberUid}`);

    await subscriberRef.update({
      status: subscription.status,
      amount: subscription.items.data[0].price.unit_amount,
      latestSubscriptionId: subscription.id,
      currentPeriodStart: convertUnixToFirestoreTimestamp(
        subscription.current_period_start
      ),
      currentPeriodEnd: convertUnixToFirestoreTimestamp(
        subscription.current_period_end
      ),
      subscriptionIds: FieldValue.arrayUnion(subscription.id),
      cancelAt: subscription.cancel_at
        ? convertUnixToFirestoreTimestamp(subscription.cancel_at)
        : null,
      cancelledAt: subscription.canceled_at
        ? convertUnixToFirestoreTimestamp(subscription.canceled_at)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
    // Add free trial for the purpose of resetting the billing cycle if the subscription was past_due and now become active
    if (
      userSubscriptionData?.status === "past_due" &&
      subscription.status === "active"
    ) {
      await addFreeTrialToResetBillingPeriod(subscription.id, account);
      logInfo("Billing cycle reset");
    }

    const creator = await getUser(creatorUid, true);

    // Send a user notification when the subscription is canceled
    if (
      userSubscriptionData?.status !== "canceled" &&
      subscription.status === "canceled"
    ) {
      const notificationData = {
        title: creator?.displayName || creator?.username || "Educator",
        type: InAppNotificationType.USER_CANCEL_SUBSCRIPTION,
        iconType: InAppNotificationIconType.STORAGE,
        message: "Subscription canceled.",
        iconStorageUrl: creator?.avatar_url,
        metadata: {
          userId: subscriberUid,
          creatorId: creatorUid,
          creatorUsername: creator?.username,
        },
      };
      await sendNotification({ to: subscriberUid, data: notificationData });
    }

    // Send a user notification when the subscription is scheduled for cancelation
    if (
      userSubscriptionData?.cancelAtPeriodEnd === false &&
      subscription.cancel_at_period_end &&
      subscription.cancel_at
    ) {
      const cancelAt = format(
        new Date(subscription.cancel_at * 1000),
        "MMM dd"
      );
      const notificationData = {
        title: creator?.displayName || creator?.username || "Educator",
        type: InAppNotificationType.USER_CANCEL_SUBSCRIPTION,
        iconType: InAppNotificationIconType.STORAGE,
        message: `Subscription ends by ${cancelAt}.`,
        iconStorageUrl: creator?.avatar_url,
        metadata: {
          userId: subscriberUid,
          creatorId: creatorUid,
          creatorUsername: creator?.username,
        },
      };
      await sendNotification({ to: subscriberUid, data: notificationData });

      const emailData: EmailDynamicDataType = {
        type: EmailType.SUBSCRIPTION_CANCELED_ONE,
        creatorName: creator?.displayName || creator?.username || "Educator",
        creatorProfileUrl: creator?.avatar_url || "",
        contentAccessDate: format(
          new Date(subscription.cancel_at * 1000),
          "MMMM dd, yyyy"
        ),
      };
      await sendEmail({
        userId: subscriberUid,
        data: emailData,
      });
    }

    logInfo("Subscription updated");
  } catch (error) {
    logError("Error occured while updating subscription", error);
  }
};
