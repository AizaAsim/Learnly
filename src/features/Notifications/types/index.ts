import { Timestamp } from "firebase/firestore";

export enum NotificationType {
  // Educator notifications
  CREATOR_NEW_SUBSCRIBER = "creator_new_subscriber",
  CREATOR_TOS_UPDATE = "creator_tos_update",
  CREATOR_EMAIL_UPDATE = "creator_email_update",
  CREATOR_NEW_ACCOUNT = "creator_new_account",
  CREATOR_POST_REMOVED = "creator_post_removed",
  CREATOR_POST_RESTORED = "creator_post_restored",
  CREATOR_POST_DELETED = "creator_post_deleted",

  // User notifications
  USER_NEW_SUBSCRIPTION = "user_new_subscription",
  USER_CANCEL_SUBSCRIPTION = "user_cancel_subscription",
  USER_SCHEDULE_CANCEL_SUBSCRIPTION = "user_schedule_cancel_subscription",
  USER_PAYMENT_FAILED = "user_payment_failed",
  USER_NEW_POST = "user_new_post",
  USER_TOS_UPDATE = "user_tos_update",
  USER_EMAIL_UPDATE = "user_email_update",
  USER_PAYMENT_METHOD_UPDATE = "user_payment_method_update",
  USER_BLOCKED = "user_blocked",
  USER_UNBLOCKED = "user_unblocked",
}

export enum NotificationIconType {
  STATIC = "static", // Built-in frontend icons
  STORAGE = "storage", // Firebase storage URLs/refs
}

export const NotificationIconMap: Partial<Record<NotificationType, string>> = {
  [NotificationType.CREATOR_NEW_ACCOUNT]: "/icon/congratulation.svg",
  [NotificationType.USER_PAYMENT_METHOD_UPDATE]:
    "/icon/payment-methods/card.svg",
  // Add other mappings
} as const;

type AnyData = {
  [key: string]: unknown;
};

export type Notification = {
  id: string;
  title: string;
  iconType: NotificationIconType;
  iconStorageUrl?: string;
  message: string;
  sentAt: Timestamp;
  readAt: Timestamp | null;
  clearAt: Timestamp | null;
  type: NotificationType;
  metadata?: AnyData;
};
