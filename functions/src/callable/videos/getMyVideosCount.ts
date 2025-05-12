import { HttpsError, onCall } from "firebase-functions/v2/https";
import { logError } from "../../services/logging";
import { corsOptions } from "../../config/corsOptions";
import { getUserRole } from "../../services/users";
import { getVideoCount } from "../../services/creatorStats";
import { VideoStates } from "../../types/videoStatus";

export const getMyVideosCount = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }

    const role = await getUserRole(uid);
    if (role !== "creator") {
      throw new HttpsError("permission-denied", "User is not a creator");
    }

    const [drafts, scheduled, archived, active] = await Promise.all([
      getVideoCount(uid, VideoStates.DRAFT),
      getVideoCount(uid, VideoStates.SCHEDULED),
      getVideoCount(uid, VideoStates.ARCHIVED),
      getVideoCount(uid, VideoStates.ACTIVE),
    ]);

    return {
      drafts,
      scheduled,
      archived,
      active,
    };
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to fetch video counts");
  }
});
