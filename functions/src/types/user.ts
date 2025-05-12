export type User = {
  id: string;
  username: string;
  displayName: string;
  role: string;
  avatar_url: string;
  emailVerified: boolean;
};

export interface UserNotificationSettings {
  newSubscribers: boolean;
  productsUpdates: boolean;
  newsletters: boolean;
  newPosts: boolean;
  creatorUpdates: boolean;
}
