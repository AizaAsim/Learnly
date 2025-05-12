import { functions } from "@/services/firebase";
import { httpsCallable } from "firebase/functions";
import { Thumbnail, VideoTokens } from "../types";
import { ReelData } from "@/types";

export const getUploadUrl = httpsCallable<void, { id: string; url: string }>(
  functions,
  "videos-getUploadUrl"
);

export const getTokens = httpsCallable<{ videoId: string }, VideoTokens>(
  functions,
  "videos-getTokens"
);

export const cancelUpload = httpsCallable<{ uploadId: string }, { id: string }>(
  functions,
  "videos-cancelUpload"
);

export const handleVideoState = httpsCallable<
  {
    action: "publish" | "draft" | "schedule" | "cancel";
    videoId: string;
    reelData?: {
      link?: string;
      description?: string;
      scheduledAt?: Date;
    };
  },
  void
>(functions, "videos-handleVideoState");

export const publishReel = httpsCallable<{ reelId: string }, boolean>(
  functions,
  "reels-publishReel"
);

export const onReelBlacklist = httpsCallable<{ reelId: string }, void>(
  functions,
  "reels-onReelBlacklist"
);

export const getThumbnailOptions = httpsCallable<
  { uploadId: string },
  { thumbnails: Thumbnail[] }
>(functions, "videos-getThumbnailOptions");

export const getReelById = httpsCallable<{ reelId: string }, ReelData>(
  functions,
  "reels-getReel"
);
