import { MonthlyEarning } from "@/features/Insights/types";
import { Notification } from "@/features/Notifications/types";
import { CreatorProfileData, MyProfileData } from "@/features/Profile/types";
import { PaymentMethod } from "@/features/Stripe/types";
import { Thumbnail, VideoInfo } from "@/features/Videos/types";
import {
  CreatorInfo,
  ReelData,
  ReelDataWithSubscriptionStatus,
  ServiceHealth,
} from "@/types";
import { Subscriber } from "@/features/Stripe/types";

export interface HealthState {
  status: "idle" | "loading" | "succeeded" | "failed";
  services: ServiceHealth[];
  error: string | null;
}

export interface BlockedReelState {
  reelId: string;
  reel: ReelData | null;
  status: "idle" | "loading" | "errored";
  error: string | null;
}

export interface CreatorDetailsState {
  creators: CreatorInfo[];
  status: "idle" | "loading" | "errored";
  error: unknown;
}

export interface CreatorProfileState {
  profileData: CreatorProfileData | null;
  creatorVideos: ReelData[];
  isSubscribed: boolean;
  isPastDue: boolean;
  isCreatorAccountDeleted: boolean;
  creatorId: string | null;
  username: string | null;
  profileLoading: boolean;
  profileError: string | null;
  videosLoading: boolean;
  videosError: string | null;
  email: string | null;
}

export interface CreatorStatsState {
  selectedMonth: string;
  earnings: {
    monthlyData: MonthlyEarning[];
    loading: boolean;
    error: string | null;
  };
}

export interface HomeReelsState {
  reels: ReelData[];
  status: "idle" | "loading" | "errored";
  error: unknown;
}

export type MyProfileState = {
  lastUpdated: number;
  status: "idle" | "loading";
  error: unknown;
} & MyProfileData;

export type MyVideosState = {
  reels: ReelData[];
  status: "idle" | "loading" | "errored";
  error: unknown;
  lastUpdated: number;
};

export type NotificationState = {
  notifications: Notification[];
  status: "idle" | "loading";
  error: unknown;
};

export interface PaymentMethodsState {
  items: PaymentMethod[];
  loading: boolean;
  error: string | null;
  pendingAdditions: string[]; // Track temporary payment methods
  pendingDeletions: string[]; // Track cards being deleted
}

export type ReelUploadState = {
  uploadId: string | null;
  scheduleDate: string | null;
  tempScheduleDate: string | null;
  scheduleTime: string | null;
  thumbnails: Thumbnail[];
  selectedThumbnail: Thumbnail | null;
  video: VideoInfo | null;
  description: string;
  link: string;
  file: File | null;
};

export interface SavedReelsState {
  reels: ReelDataWithSubscriptionStatus[];
  status: "idle" | "loading" | "errored";
  error: string | null;
  hasMore: boolean;
  lastDocId: string | null;
}

export interface SearchState {
  isLoading: boolean;
  creators: CreatorInfo[];
  hasMore: boolean;
  term: string;
  isEmpty: boolean;
  offset: number;
}

export interface SubscribersSliceState {
  learners: Subscriber[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  hasMore: boolean;
  numberOfSubscribers: number;
}
