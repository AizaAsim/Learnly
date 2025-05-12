import Mux from "@mux/mux-node";
import { HeadersLike } from "@mux/mux-node/core";
import { HttpsError, Request } from "firebase-functions/v2/https";
import { logError } from "./logging";

export enum TokenTypes {
  PLAYBACK = "video",
  THUMBNAIL = "thumbnail",
  STORYBOARD = "storyboard",
}

export type TokenType = TokenTypes;

export type ThumbnailOptions = {
  time?: number;
  width?: number;
  height?: number;
  rotate?: number;
  fitMode?: "preserve" | "stretch" | "crop" | "smartcrop" | "pad";
  flip_v?: boolean;
  flip_h?: boolean;
};

export const getMux = () => {
  if (!process.env.MUX_SIGNING_KEY_SECRET) {
    throw new HttpsError("internal", "Something went wrong!");
  }

  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  });

  const muxSecretKey = Buffer.from(
    process.env.MUX_SIGNING_KEY_SECRET,
    "base64"
  ).toString("ascii");

  const config = {
    keyId: process.env.MUX_SIGNING_KEY_ID,
    keySecret: muxSecretKey,
  };

  return { mux, config };
};

/**
 * Creates an authorized upload URL for Mux Video
 * @returns (string) The URL to upload a video to Mux
 */
export const createUploadUrl = async (creatorId: string) => {
  const { mux } = getMux();
  return mux.video.uploads.create({
    cors_origin:
      process.env.NODE_ENV === "production"
        ? `${process.env.APPLICATION_DOMAIN}`
        : "*",
    new_asset_settings: {
      playback_policy: ["signed"],
      encoding_tier: `${process.env.MUX_ENCODING_TIER}` as "smart" | "baseline",
      passthrough: creatorId,
    },
  });
};

/**
 * Cancels an ongoing video upload process with the specified upload ID.
 * @param {string} uploadId - The unique identifier of the video upload to cancel.
 * @returns {Promise<Mux.Video.Uploads.Upload>} A Promise that resolves with the canceled upload object.
 */
export const cancelVideoUpload = async (uploadId: string) => {
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  });

  return mux.video.uploads.cancel(uploadId);
};

/**
 * Get a signed playback token for a Mux video
 * If you pass in the asset id, it will return the playback id for that asset
 * If you pass in the playback id (and options), it will return a signed jwt to be used by their api
 * @param param0 asset id or playback id of the video
 * @returns A signed playback token or playback id
 */
export const getToken = ({
  videoId,
  type,
  opts,
}: {
  videoId: string;
  type: TokenType;
  opts?: object;
}) => {
  const { mux, config } = getMux();
  return mux.jwt.signPlaybackId(videoId, {
    ...config,
    type,
    params: { ...opts },
  });
};

/**
 * Get all signed playback tokens for a Mux video
 * @param videoId Signed Mux video id
 * @returns An object containing signed playback tokens
 */
export const getVideoTokens = async (videoId: string) => {
  const playback = await getToken({ videoId, type: TokenTypes.PLAYBACK });
  const thumbnail = await getToken({ videoId, type: TokenTypes.THUMBNAIL });
  const storyboard = await getToken({ videoId, type: TokenTypes.STORYBOARD });

  return { playback, thumbnail, storyboard };
};

export const verifyWebhook = async (req: Request) => {
  const { mux } = getMux();
  const headers = req.headers as HeadersLike;
  const body = req.rawBody.toString();
  const webhookSecret = process.env.MUX_WEBHOOK_SECRET;

  mux.webhooks.verifySignature(body, headers, webhookSecret);

  return true;
};

/**
 * Deletes a video from Mux
 * @param {string} assetId - The id of the asset to delete.
 * @returns {Promise<void>} A Promise that resolves when the video is deleted.
 */
export const deleteAsset = async (assetId: string) => {
  const { mux } = getMux();
  return mux.video.assets.delete(assetId);
};

/**
 * This takes a signed playback ID and returns a URL to the thumbnail image
 * @param playbackId A signed playback ID (the result of calling one of xxxToken functions)
 * @returns The URL to the thumbnail image
 */
export const getThumbnailUrl = async (
  playbackId: string,
  opts: ThumbnailOptions = {
    width: 180,
    height: 320,
  }
) => {
  const thumbToken = await getToken({
    videoId: playbackId,
    type: TokenTypes.THUMBNAIL,
    opts,
  });
  return `https://image.mux.com/${playbackId}/thumbnail.webp?token=${thumbToken}`;
};

export const getMultipleFramesWithTime = async (
  playbackId: string,
  fractionalTime: number[],
  duration: number
) => {
  // Generate positions based on video duration
  const rawPositions = fractionalTime.map((factor) =>
    parseFloat((duration * factor).toFixed(2))
  );

  // Remove duplicates (e.g., for shorter videos)
  const uniquePositions = Array.from(new Set(rawPositions));

  // Generate thumbnail URLs and include the corresponding time
  const thumbnails = await Promise.all(
    uniquePositions.map(async (time) => {
      const url = await getThumbnailUrl(playbackId, {
        width: undefined,
        height: undefined,
        time,
      });
      return { time, url };
    })
  );
  return thumbnails;
};

/**
 * Get view count for specific video
 */
export const getReelViews = async (assetId: string) => {
  const { mux } = getMux();
  try {
    const result = await mux.data.dimensions.listValues(`asset_id`, {
      filters: [`asset_id:${assetId}`],
      limit: 1,
    });
    return result.data?.[0]?.total_count || 0;
  } catch (error) {
    logError(error);
    return 0;
  }
};
