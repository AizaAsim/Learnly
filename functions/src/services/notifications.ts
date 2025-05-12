import { firestore } from "./firebaseAdmin";
import { logError } from "./logging";
import { UserNotificationSettings } from "../types/user";
import {
  CommunicationMetadata,
  InAppNotificationType,
  NotificationDataType,
  NotificationSetting,
  TopicType,
} from "../types/pubsub";
import { publishMessage } from "../shared/helpers/pubsub";

const inAppNotificationTypeToNotificationSettingMap: Partial<
  Record<InAppNotificationType, NotificationSetting>
> = {
  [InAppNotificationType.CREATOR_NEW_SUBSCRIBER]:
    NotificationSetting.NEW_SUBSCRIBERS,
  [InAppNotificationType.USER_NEW_POST]: NotificationSetting.NEW_POSTS,
};

/**
 *
 * @param userId User to check against
 * @param notificationType Notification type to check
 * @returns Whether the user has enabled the specified notification
 */
export const notificationEnabled = async (
  userId: string,
  notificationType: NotificationSetting
): Promise<boolean> => {
  try {
    const settings = (
      await firestore
        .collection("users")
        .doc(userId)
        .collection("settings")
        .doc("notifications")
        .get()
    ).data() as UserNotificationSettings;

    return settings[notificationType];
  } catch (error) {
    logError([
      "Error occurred while checking if user has enabled in-app notifications",
      error,
    ]);
  }
  return false;
};

type SendNotifcationProps = {
  to: string | string[];
  data: Omit<NotificationDataType, "id" | "sentAt" | "readAt" | "clearAt">;
};
export const sendNotification = async ({ to, data }: SendNotifcationProps) => {
  const metadata = { to, deliveryMethods: ["in_app"] } as CommunicationMetadata;

  const userNotificationSettingKey =
    inAppNotificationTypeToNotificationSettingMap[data.type] || null;

  if (userNotificationSettingKey) {
    // Check if the user has enabled this type of notification
    const hasUserEnabled = await notificationEnabled(
      to as string,
      userNotificationSettingKey
    );
    if (!hasUserEnabled) return;
  }

  try {
    publishMessage(TopicType.COMMUNICATION, {
      data,
      metadata,
    });
  } catch (error) {
    logError("Error sending notification.", event, error);
  }
};
