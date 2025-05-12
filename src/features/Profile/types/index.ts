import { UserRootDoc } from "@/features/Auth/types";
import { Timestamp } from "firebase/firestore";

export type MyProfileData = {
  counts: {
    active: number;
    likes: number;
    // bookmakrs: number;
    views: number;
  };
};

export type CreatorProfileData = MyProfileData &
  UserRootDoc & {
    subscriptionPrice: number;
    isSubscriptionActivated: boolean;
    isSubscribed: boolean;
    cancelAtPeriodEnd: boolean;
  };

export interface SubscribedCreatorData {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  profileSlug: string;
  isVerified: boolean;
}

export interface BlockedUser {
  creatorId: string;
  userId: string;
  timestamp: Timestamp;
  blocked: boolean;
}
