import Stripe from "stripe";
import { Timestamp } from "firebase-admin/firestore";

export type AnyData = {
  [key: string]: unknown;
};

// ** TOPICS (Channels) **
export enum TopicType {
  COMMUNICATION = "COMMUNICATION",
  SUBSCRIPTION = "SUBSCRIPTION",
  USER_ACTION = "USER_ACTION",
}

// ** COMMUNICATION **
export enum DeliveryMethod {
  IN_APP = "in_app",
  EMAIL = "email",
  SMS = "sms",
}

export type CommunicationMetadata = {
  deliveryMethods: DeliveryMethod[];
  to: string | string[];
} & AnyData;

export enum InAppNotificationType {
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

export enum InAppNotificationIconType {
  STATIC = "static", // Built-in frontend icons
  STORAGE = "storage", // Firebase storage URLs/refs
}

export type NotificationDataType = {
  id: string;
  title: string;
  iconType: InAppNotificationIconType;
  iconStorageUrl?: string;
  message: string;
  sentAt: Timestamp;
  readAt: Timestamp | null;
  clearAt: Timestamp | null;
  type: InAppNotificationType;
  metadata?: AnyData;
};

export enum EmailType {
  ACTIVATE_YOUR_SUBSCRIPTION = "activate_your_subscription",
  FINISH_SETTING_ACCOUNT = "finish_setting_account",
  SUBSCRIPTION_IS_ACTIVE = "subscription_is_active",
  STRIPE_APPLICATION_DENIED = "stripe_application_denied",
  STRIPE_ACCOUNT_ISSUE = "stripe_account_issue",
  ACCOUNT_DEACTIVATED = "account_deactivated",
  PROFILE_NOT_VISIBLE = "profile_not_visible",
  APPEAL_SUBMITTED = "appeal_submitted",
  PAYMENT_INFO_MISSING = "payment_info_missing",
  PAYMENT_FAILED = "payment_failed",
  SUBSCRIPTION_CANCELED_ONE = "subscription_canceled_one",
  SUBSCRIPTION_CANCELED_TWO = "subscription_canceled_two",
  ACCOUNT_LIMITED = "account_limited",
  NEW_SUBSCRIBER = "new_subscriber",
  POST_RESTORED = "post_restored",
  POST_DELETED = "post_deleted",
  NEW_POST = "new_post",
  NEW_SUBSCRIPTION = "new_subscription",
  PAYMENT_CONFIRMATION = "payment_confirmation",
  ACCOUNT_PERMANENTLY_BANNED_CREATOR = "account_permanently_banned_creator",
  ACCOUNT_INACTIVE = "account_inactive",
  ACCOUNT_CLOSE_TO_DELETION = "account_close_to_deletion",
  WARNING = "warning",
  LAST_CHANCE = "last_chance",
  ACCOUNT_PERMANENTLY_BANNED_USER = "account_permanently_banned_user",
  TECHNICAL_ERROR = "technical_error",
  POST_REMOVED = "post_removed",
  ACCOUNT_DELETED = "account_deleted",
  TERMS_OF_SERVICE_UPDATE = "terms_of_service_update",
  PRIVACY_POLICY_UPDATE = "privacy_policy_update",
}
export type EmailDynamicDataType =
  | {
      type: EmailType.ACTIVATE_YOUR_SUBSCRIPTION;
      stripeAccountUrl: string;
    }
  | {
      type: EmailType.FINISH_SETTING_ACCOUNT;
      stripeAccountUrl: string;
    }
  | {
      type: EmailType.SUBSCRIPTION_IS_ACTIVE;
      uploadReelUrl: string;
    }
  | {
      type: EmailType.STRIPE_APPLICATION_DENIED;
      stripeApplicationDenied: string;
    }
  | {
      type: EmailType.STRIPE_ACCOUNT_ISSUE;
      stripeApplicationDenied: string;
      contactStripeDate: string;
    }
  | {
      type: EmailType.ACCOUNT_DEACTIVATED;
      stripeApplicationDenied: string;
    }
  | {
      type: EmailType.PROFILE_NOT_VISIBLE;
      stripeAccountUrl: string;
    }
  | {
      type: EmailType.APPEAL_SUBMITTED;
      contentGuidelinesUrl: string;
    }
  | {
      type: EmailType.PAYMENT_INFO_MISSING;
      pageUrl: string;
    }
  | {
      type: EmailType.PAYMENT_FAILED;
      creatorName: string;
      retryPaymentUrl: string;
    }
  | {
      type: EmailType.SUBSCRIPTION_CANCELED_ONE;
      creatorName: string;
      creatorProfileUrl: string;
      contentAccessDate: string;
    }
  | {
      type: EmailType.SUBSCRIPTION_CANCELED_TWO;
      creatorName: string;
      creatorProfileUrl: string;
    }
  | {
      type: EmailType.ACCOUNT_LIMITED;
      contactSupportUrl: string;
    }
  | {
      type: EmailType.NEW_SUBSCRIBER;
      subscriberName: string;
      subscriberAvatarUrl?: string;
      subscriptionAmount: string;
    }
  | {
      type: EmailType.POST_RESTORED;
      reelThumbnailUrl: string;
      reelPublishedAt: string;
    }
  | {
      type: EmailType.POST_DELETED;
      reelThumbnailUrl: string;
      reelPublishedAt: string;
      contentGuidelinesUrl: string;
    }
  | {
      type: EmailType.NEW_POST;
      creatorName: string;
      reelThumbnailUrl: string;
      reelUrl: string;
    }
  | {
      type: EmailType.NEW_SUBSCRIPTION;
      subscriberName: string;
      creatorName: string;
      creatorProfileUrl: string;
      subscriptionAmount: string;
      invoiceID: string;
      cardTypeImage: string;
      paymentMethod: string;
      paymentDate: string;
    }
  | {
      type: EmailType.PAYMENT_CONFIRMATION;
      subscriberName: string;
      subscriptionAmount: string;
      creatorProfileUrl: string;
      invoiceID: string;
      cardTypeImage: string;
      paymentMethod: string;
      paymentDate: string;
    }
  | {
      type: EmailType.ACCOUNT_PERMANENTLY_BANNED_CREATOR;
      contentGuidelinesUrl: string;
      helpCenterUrl: string;
    }
  | {
      type: EmailType.ACCOUNT_INACTIVE;
      helpCenterUrl: string;
    }
  | {
      type: EmailType.ACCOUNT_CLOSE_TO_DELETION;
      helpCenterUrl: string;
    }
  | {
      type: EmailType.WARNING;
      helpCenterUrl: string;
    }
  | {
      type: EmailType.LAST_CHANCE;
      helpCenterUrl: string;
    }
  | {
      type: EmailType.ACCOUNT_PERMANENTLY_BANNED_USER;
      termsOfServiceUrl: string;
      helpCenterUrl: string;
    }
  | {
      type: EmailType.TECHNICAL_ERROR;
      helpCenterUrl: string;
    }
  | {
      type: EmailType.POST_REMOVED;
      violationType: string;
      reelThumbnailUrl: string;
      reelPublishedAt: string;
      contentGuidelinesUrl: string;
    }
  | {
      type: EmailType.ACCOUNT_DELETED;
    }
  | {
      type: EmailType.TERMS_OF_SERVICE_UPDATE;
      termsOfServiceUrl: string;
      TOSUpdateDate: string;
      helpCenterUrl: string;
    }
  | {
      type: EmailType.PRIVACY_POLICY_UPDATE;
      privacyPolicyUrl: string;
      privacyPolicyUpdateDate: string;
      helpCenterUrl: string;
    };

export type SmsDataType = {
  text: string;
};

// ** SUBSCRIPTION **

export enum SubscriptionAction {
  CREATE = "create",
  UPDATE = "update",
}

export type SubscriptionMetadata = {
  action: SubscriptionAction;
} & AnyData;

export type SubscriptionData = {
  subscription: Stripe.Subscription;
  account?: string;
};

// ** USER ACTIONS **

export enum UserAction {
  SOFT_DELETE_USER = "soft_delete_user",
  SOFT_DELETE_CREATOR = "soft_delete_creator",
}

export type UserActionMetadata = {
  action: UserAction;
} & AnyData;

export type UserActionData = {
  userId: string;
};

// ** DATA / METADATA MAPS **
export type TopicDataMap = {
  [TopicType.COMMUNICATION]:
    | NotificationDataType
    | EmailDynamicDataType
    | SmsDataType;
  [TopicType.SUBSCRIPTION]: SubscriptionData;
  [TopicType.USER_ACTION]: UserActionData;
};

export type TopicMetadataMap = {
  [TopicType.COMMUNICATION]: CommunicationMetadata;
  [TopicType.SUBSCRIPTION]: SubscriptionMetadata;
  [TopicType.USER_ACTION]: UserActionMetadata;
};

// ** Composed Data Type **
export type TopicData<T extends TopicType> = {
  metadata: TopicMetadataMap[T];
  data: TopicDataMap[T];
};

export enum NotificationSetting {
  NEW_SUBSCRIBERS = "newSubscribers",
  CREATOR_UPDATES = "creatorUpdates",
  NEW_POSTS = "newPosts",
  NEWSLETTERS = "newsletters",
  PRODUCT_UPDATES = "productsUpdates",
}
