import { logError, logInfo } from "../../services/logging";
import {
  retrieveDocument,
  upsertIndexWithDocuments,
} from "../../services/meilisearch";
import { sendNotification } from "../../services/notifications";
import { sendEmail } from "../../services/sendgrid";
import { addSubscriptionDocuments } from "../../services/subscription";
import { getUser } from "../../services/users";
import {
  EmailType,
  EmailDynamicDataType,
  InAppNotificationIconType,
  InAppNotificationType,
  SubscriptionData,
} from "../../types/pubsub";
import { format } from "date-fns"; // ✅ Cleaned import

export const addHandler = async ({ subscription }: SubscriptionData) => {
  try {
    await addSubscriptionDocuments(subscription);

    const { creatorUid, subscriberUid } = subscription.metadata;
    const document = await retrieveDocument("users", subscriberUid);
    if (document) {
      const subscribedTo = new Set(document.subscribedTo || []);
      subscribedTo.add(creatorUid);

      const updatedDocument = {
        ...document,
        subscribedTo: Array.from(subscribedTo),
      };
      await upsertIndexWithDocuments("users", [updatedDocument]);
    }

    const [subscriber, creator] = await Promise.all([
      getUser(subscriberUid),
      getUser(creatorUid),
    ]);

    const subscriberNotificationData = {
      title: creator?.displayName || creator?.username || "Educator",
      type: InAppNotificationType.USER_NEW_SUBSCRIPTION,
      iconType: InAppNotificationIconType.STORAGE,
      message: "Subscribed successfully.",
      iconStorageUrl: creator?.avatar_url,
      metadata: {
        userId: subscriberUid,
        creatorId: creatorUid,
        creatorUsername: creator?.username,
      },
    };

    await sendNotification({
      to: subscriberUid,
      data: subscriberNotificationData,
    });

    const subscriptionAmount =
      subscription.items.data[0].price.unit_amount &&
      (subscription.items.data[0].price.unit_amount / 100).toFixed(2);

    const invoiceID =
      typeof subscription.latest_invoice === "string"
        ? subscription.latest_invoice
        : subscription.latest_invoice?.id || "N/A";

    // ✅ Updated to match EmailDynamicDataType exactly
    const subscriberEmailData: EmailDynamicDataType = {
      type: EmailType.NEW_SUBSCRIPTION,
      subscriberName: subscriber?.displayName || "Learner",
      creatorName: creator?.displayName || creator?.username || "Educator",
      creatorProfileUrl: `${process.env.APPLICATION_DOMAIN}/${creator?.username}`,
      subscriptionAmount: `${subscriptionAmount}` || "0.00",
      invoiceID,
      cardTypeImage: "https://example.com/card.png", // Replace with actual if needed
      paymentMethod:
        typeof subscription.default_payment_method === "string"
          ? subscription.default_payment_method
          : "Unknown",
      paymentDate: format(
        new Date(subscription.start_date * 1000),
        "EEEE, MMMM dd, yyyy"
      ),
    };

    await sendEmail({
      userId: subscriberUid,
      data: subscriberEmailData,
    });

    const creatorNotificationData = {
      title: subscriber?.displayName || "Learner",
      type: InAppNotificationType.USER_NEW_SUBSCRIPTION,
      iconType: InAppNotificationIconType.STORAGE,
      message: "Purchased a subscripton.",
      iconStorageUrl: subscriber?.avatar_url,
    };

    await sendNotification({
      to: creatorUid,
      data: creatorNotificationData,
    });

    const creatorEmailData: EmailDynamicDataType = {
      type: EmailType.NEW_SUBSCRIBER,
      subscriberName: subscriber?.displayName || "Learner",
      subscriberAvatarUrl: subscriber?.avatar_url,
      subscriptionAmount: `${subscriptionAmount}` || "0.00",
    };

    await sendEmail({
      userId: creatorUid,
      data: creatorEmailData,
    });

    logInfo("New subscription added");
  } catch (error) {
    logError("Error occurred while adding subscription", error);
  }
};
