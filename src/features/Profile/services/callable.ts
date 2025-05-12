import { UserSubscription } from "@/features/Stripe/types";
import { functions } from "@/services/firebase";
import { ReelData, ReelDataWithSubscriptionStatus } from "@/types";
import { httpsCallable } from "firebase/functions";
import { MyProfileData, SubscribedCreatorData } from "../types";

export const blockUser = httpsCallable<
  { userId: string },
  { blocked: boolean; refundAmount: number }
>(functions, "users-block");

export const unblockUser = httpsCallable<
  { userId: string },
  { blocked: boolean }
>(functions, "users-unblock");

export const getMyProfileData = httpsCallable<void, MyProfileData>(
  functions,
  "views-getMyProfileData"
);

export const getUserSubscriptionList = httpsCallable<
  void,
  { creatorsData: SubscribedCreatorData[] }
>(functions, "views-getUserSubscriptionsList");

export const getMyVideoData = httpsCallable<
  void,
  {
    reels: ReelData[];
  }
>(functions, "videos-getMyVideos");

export const getCreatorVideos = httpsCallable<
  { creatorUsername: string },
  {
    creatorVideos: ReelData[];
    isSubscribed: boolean;
    creatorId: string;
    isPastDue: boolean;
  }
>(functions, "videos-getCreatorVideos");

export const getMyVideosCount = httpsCallable<
  void,
  { drafts: number; scheduled: number; archived: number; active: number }
>(functions, "videos-getMyVideosCount");

export const getCreatorSubscribersList = httpsCallable<
  { query: string; offset: number },
  { learners: UserSubscription[]; hasMore: boolean }
>(functions, "views-getCreatorSubscribersList");

export const deleteAccount = httpsCallable<void, { success: boolean }>(
  functions,
  "users-deleteAccount"
);

export const getHomeReels = httpsCallable<void, { reels: ReelData[] }>(
  functions,
  "reels-homeReels"
);

export const getSavedReels = httpsCallable<
  { lastDocId?: string },
  {
    reels: ReelDataWithSubscriptionStatus[];
    hasMore: boolean;
    lastDocId: string | undefined;
  }
>(functions, "reels-savedReels");
