import { AIModeration, FrameModerationResult } from "../types/moderation";
import {
  InAppNotificationIconType,
  InAppNotificationType,
} from "../types/pubsub";
import { getThumbnailUrl } from "./mux";
import { sendNotification } from "./notifications";
import { getReelDoc } from "./videos";
import { Moderation } from "openai/resources";
import { firestore } from "./firebaseAdmin";
import { getMultipleFramesWithTime } from "./mux";
import { moderateImage, moderateText } from "./openai";
import { omitProperties } from "../shared/helpers/utils";

const omitCategoryAppliedInputTypes = (moderation: Moderation) =>
  omitProperties(moderation, ["category_applied_input_types"]);

export const moderateReelByAI = async (reelId: string) => {
  const reel = await getReelDoc(reelId);
  const { duration, playbackIds, description, link, creatorId } = reel;

  const frames = await getMultipleFramesWithTime(
    playbackIds[0].id,
    [0.25, 0.5, 0.75],
    duration
  );

  const framesModerationPromises = frames.map((frame) =>
    moderateImage(frame.url)
  );

  const framesModeration = await Promise.all(framesModerationPromises);

  const frameModerationResult: FrameModerationResult[] = frames.map(
    (frame, index) => {
      const result = omitCategoryAppliedInputTypes(
        framesModeration[index].results[0]
      );

      return { frameTime: frame.time, ...result };
    }
  );

  let descriptionModeration = null;
  let isDescriptionFlagged = false;
  if (description) {
    const moderationResp = await moderateText(description);
    isDescriptionFlagged = moderationResp.results[0].flagged;
    descriptionModeration = omitCategoryAppliedInputTypes(
      moderationResp.results[0]
    );
  }

  let linkModeration = null;
  let isLinkFlagged = false;
  if (link) {
    const moderationResp = await moderateText(link);
    isLinkFlagged = moderationResp.results[0].flagged;
    linkModeration = omitCategoryAppliedInputTypes(moderationResp.results[0]);
  }

  const isFramesFlagged = framesModeration.some(
    (result) => result.results[0].flagged
  );
  const isFlagged = isFramesFlagged || isDescriptionFlagged || isLinkFlagged;

  // iterate through moderation results and add flagged categories
  const flaggedCategories = new Set<string>();

  // Process all frame moderation results
  frameModerationResult
    .filter((frame) => frame.flagged) // Check if the frame is flagged
    .forEach((frame) => {
      Object.entries(frame.categories).forEach(([category, isFlagged]) => {
        if (isFlagged) {
          flaggedCategories.add(category);
        }
      });
    });

  // Process description and link moderation results if they exist
  [descriptionModeration, linkModeration]
    .filter((modResult) => modResult !== null)
    .filter((modResult) => modResult.flagged) // Check if flagged is true
    .forEach((modResult) => {
      Object.entries(modResult.categories).forEach(([category, isFlagged]) => {
        if (isFlagged) {
          flaggedCategories.add(category);
        }
      });
    });

  const moderation: AIModeration = {
    reelId,
    creatorId,
    isFlagged,
    frames: frameModerationResult,
    description: descriptionModeration,
    link: linkModeration,
    flaggedCategories: Array.from(flaggedCategories),
  };

  await firestore.collection("ai-moderation").add(moderation);

  return moderation;
};

export const sendPostRemovedNotification = async (
  reelId: string,
  creatorId: string
) => {
  const reel = await getReelDoc(reelId);
  const thumbnailUrl = await getThumbnailUrl(reel.playbackIds[0].id, {
    time: reel.thumbnailFrameSecond,
  });
  await sendNotification({
    to: creatorId,
    data: {
      title: "Post Removed",
      message: "Content guidelines violation.",
      type: InAppNotificationType.CREATOR_POST_REMOVED,
      iconType: InAppNotificationIconType.STORAGE,
      iconStorageUrl: thumbnailUrl,
      metadata: { reelId, creatorId },
    },
  });
};

export const sendPostRestoredNotification = async (
  reelId: string,
  creatorId: string
) => {
  const reel = await getReelDoc(reelId);
  const thumbnailUrl = await getThumbnailUrl(reel.playbackIds[0].id, {
    time: reel.thumbnailFrameSecond,
  });
  await sendNotification({
    to: creatorId,
    data: {
      title: "Post Restored",
      message: "Appeal complete.",
      type: InAppNotificationType.CREATOR_POST_RESTORED,
      iconType: InAppNotificationIconType.STORAGE,
      iconStorageUrl: thumbnailUrl,
      metadata: { reelId, creatorId },
    },
  });
};

// TODO: send this notification when a post is not restored after appeal
export const sendPostDeletedNotification = async (
  reelId: string,
  creatorId: string
) => {
  const reel = await getReelDoc(reelId);
  const thumbnailUrl = await getThumbnailUrl(reel.playbackIds[0].id, {
    time: reel.thumbnailFrameSecond,
  });
  await sendNotification({
    to: creatorId,
    data: {
      title: "Post Deleted",
      message: "Appeal complete.",
      type: InAppNotificationType.CREATOR_POST_DELETED,
      iconType: InAppNotificationIconType.STORAGE,
      iconStorageUrl: thumbnailUrl,
      metadata: { reelId, creatorId },
    },
  });
};

import axios from "axios";
import jwt from "jsonwebtoken";

export const sendToModerationApp = async (
  endpoint: string,
  payload: Record<string, unknown>
) => {
  const baseUrl = process.env.MODERATION_API_URL;
  const moderationSharedSecret = process.env.MODERATION_JWT_SECRET;

  if (!baseUrl)
    throw new Error(
      "Missing required environment variable: MODERATION_API_URL."
    );
  if (!moderationSharedSecret)
    throw new Error(
      "Missing required environment variable: MODERATION_JWT_SECRET."
    );

  // Generate a JWT token with a short expiration
  const token = jwt.sign({}, moderationSharedSecret, { expiresIn: "5m" });

  // Send the request to the moderation app
  const response = await axios.post(`${baseUrl}/${endpoint}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
