import { z } from "zod";
import { VideoState } from "./videoStatus";
import { NormalizedTimestamp } from ".";
import { Timestamp } from "firebase-admin/firestore";

export type PlaybackId = {
  id: string;
  policy: string;
};

export interface CreatorInfo {
  id: string;
  displayName: string;
  username: string;
  avatar_url: string | null;
  isVerified?: boolean;
}

type TimestampField<T extends "firebase" | "normalized"> = T extends "firebase"
  ? Timestamp
  : T extends "normalized"
    ? NormalizedTimestamp
    : never;

export type ReelData<T extends "firebase" | "normalized" = "firebase"> = {
  aspectRatio: string;
  assetId: string;
  comentsEnabled: boolean;
  duration: number;
  id: string;
  playbackIds: PlaybackId[];
  status: ReelStatus;
  uploaded_at: number;
  creatorId: string;
  creator?: CreatorInfo;
  thumbnail?: string;
  likes?: number;
  bookmarks?: number;
  views?: number;
  scheduledAt?: TimestampField<T>;
  archivedAt?: TimestampField<T>;
  publishedAt?: TimestampField<T>;
  state?: VideoState;
  description?: string;
  link?: string;
  type?: VideoState;
  scheduleTaskId?: string;
  fileHash?: string;
  isBlocked?: boolean;
  blockedReason?: string;
  thumbnailFrameSecond: number;
};

export type ReelStatus = "preparing" | "waiting" | "ready" | "errored";

export const PublishReelRequest = z.object({
  reelId: z.string(),
});

export type PublishReelRequest = z.infer<typeof PublishReelRequest>;
