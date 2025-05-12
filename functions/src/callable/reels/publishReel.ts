import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { PublishReelRequest } from "../../types/reels";
import { makeReelActive } from "../../services/videos";

export const publishReel = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }
  try {
    const parsedRequest = PublishReelRequest.parse(request.data);
    const reelId = parsedRequest.reelId;
    await makeReelActive(reelId, uid);
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to publish reel.");
  }
});
