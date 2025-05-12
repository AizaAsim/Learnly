import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export enum Roles {
  ADMIN = "admin",
  USER = "user",
  CREATOR = "creator",
}

export type Role = Roles;
export type AppUser = User & {
  role: Role;
  displayName: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  isBlocked: boolean;
};

export type UserContextType = {
  user: AppUser | null;
  isAuthLoading: boolean;
  error: string;
  setError: (error: string) => void;
  clearError: () => void;
};

export interface UserPrivateDoc {
  email: string;
  claimsLastUpdated?: Timestamp;
}

export interface UserRootDoc {
  id: string;
  displayName: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  isBlocked: boolean;
}

export interface UserDoc extends UserPrivateDoc, UserRootDoc {}

export type AuthFormProps = {
  submit: (email: string) => Promise<void>;
  isLoading: boolean;
};

export enum RecoveryMethods {
  PHONE = "phone",
  EMAIL = "email",
}

export type RecoveryMethod = RecoveryMethods;

export enum NamesFields {
  displayName = "displayName",
  username = "username",
}

export enum UserNotificationSettingsFields {
  productsUpdates = "productsUpdates",
  newsletters = "newsletters",
  newPosts = "newPosts",
  creatorUpdates = "creatorUpdates",
}

type UserNotificationSettingsFieldsKeys =
  keyof typeof UserNotificationSettingsFields;

export type UserNotificationSettings = {
  [key in UserNotificationSettingsFieldsKeys]: boolean;
};

export enum CreatorNotificationSettingsFields {
  newSubscribers = "newSubscribers",
}

type CreatorNotificationSettingsFieldsKeys =
  keyof typeof CreatorNotificationSettingsFields;

export type CreatorNotificationSettings = {
  [key in CreatorNotificationSettingsFieldsKeys]: boolean;
};

export type NotificationSettings =
  | UserNotificationSettings
  | CreatorNotificationSettings;

export function isUserNotificationSettings(
  settings: NotificationSettings
): settings is UserNotificationSettings {
  return UserNotificationSettingsFields.creatorUpdates in settings;
}

export enum VerificationContext {
  SIGN_IN = "SIGN_IN",
  CURRENT_EMAIL = "CURRENT_EMAIL",
  NEW_EMAIL = "NEW_EMAIL",
  RECOVERY_EMAIL = "RECOVERY_EMAIL",
  RECOVERY_PHONE = "RECOVERY_PHONE",
  ACCOUNT_RECOVERY_EMAIL = "ACCOUNT_RECOVERY_EMAIL",
  ACCOUNT_RECOVERY_PHONE = "ACCOUNT_RECOVERY_PHONE",
}

export enum LegalInfoType {
  TOS = "tos",
  PRIVACY = "privacy",
}
