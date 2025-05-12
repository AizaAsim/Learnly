import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import {
  draftTempVideo,
  makeReelActive,
  scheduleTempVideo,
} from "../../services/videos";

export const handleVideoState = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }
    const { action, videoId, reelData } = request.data;

    if (!action) {
      throw new HttpsError(
        "invalid-argument",
        "Action is missing in the request data"
      );
    }

    if (!videoId) {
      throw new HttpsError(
        "invalid-argument",
        "Video ID is missing in the request data"
      );
    }

    switch (action) {
      case "publish":
        await makeReelActive(videoId, uid, reelData);
        break;
      case "draft":
        await draftTempVideo(uid, videoId, reelData);
        break;
      case "schedule":
        await scheduleTempVideo(uid, videoId, reelData);
        break;
      case "cancel":
        // When the video is cancelled, the cleanup task will take care of deleting the temp post
        // The case is handled in the tempPostGarbageCleaner trigger
        // The case statement is kept here for future use
        break;
      default:
        throw new HttpsError("invalid-argument", "Invalid action");
    }
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to handle video state");
  }
});
