import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getMultipleFramesWithTime } from "../../services/mux";
import { getReelDoc } from "../../services/videos";

export const getThumbnailOptions = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }
    const { uploadId } = request.data;

    if (!uploadId) {
      throw new HttpsError(
        "invalid-argument",
        "Upload ID is missing in the request data"
      );
    }

    const video = await getReelDoc(uploadId);
    const { playbackIds, duration } = video;

    if (!playbackIds?.length || !duration) {
      throw new HttpsError(
        "invalid-argument",
        "Playback IDs or duration is missing in the video data"
      );
    }

    const thumbnails = await getMultipleFramesWithTime(
      playbackIds[0].id,
      [0, 0.2, 0.4, 0.6, 0.8],
      duration
    );

    return { thumbnails };
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to generate thumbnail options");
  }
});
