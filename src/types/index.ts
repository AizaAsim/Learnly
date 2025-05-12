import { PlaybackId, Status } from "@/features/Videos/types";

export interface RestProps {}

export type ErrorType = "404" | "500" | "503";

export interface CreatorSubscriptionInfo {
  creatorUid: string;
  productStripeId: string;
  subscriptionPrice: number;
}

export interface CreatorInfo {
  id: string;
  displayName: string;
  username: string;
  avatar_url: string | null;
  isVerified?: boolean;
}

export type ReelData = {
  aspectRatio: string;
  assetId: string;
  comentsEnabled: boolean;
  duration: number;
  id: string;
  playbackIds: PlaybackId[];
  status: Status;
  uploaded_at: number;
  creatorId: string;
  creator?: CreatorInfo;
  thumbnail?: string;
  likes?: number;
  bookmarks?: number;
  likesCount?: number;
  bookmarksCount?: number;
  views?: number;
  scheduledAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  archivedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  publishedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  type?: "draft" | "scheduled" | "active" | "archived";
  description?: string;
  link?: string;
  isBlocked: boolean;
  blockedReason?: string;
};

export type ReelUrlType = "video" | "draft" | "scheduled";

export type FirebaseTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

export type ReelDataWithSubscriptionStatus = ReelData & {
  isSubscribed: boolean;
};

export enum ServiceStatus {
  UP = "UP",
  DOWN = "DOWN",
}

export interface ServiceHealth {
  status: ServiceStatus;
  name: string;
  error?: string;
}
