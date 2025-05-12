import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getThumbnailUrl } from "../../services/mux";
import { getReelDoc } from "../../services/videos";

export const getReel = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }
  const reelId = request.data.reelId;
  if (!reelId) {
    throw new HttpsError(
      "invalid-argument",
      "EduClip ID is missing in the request data"
    );
  }

  try {
    const reel = await getReelDoc(reelId);

    if (reel.creatorId !== uid) {
      throw new HttpsError(
        "permission-denied",
        "User is not the creator of the reel"
      );
    }

    const thumbnail = await getThumbnailUrl(reel.playbackIds[0].id, {
      time: reel.thumbnailFrameSecond,
    });
    return { ...reel, thumbnail };
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to get reel");
  }
});
