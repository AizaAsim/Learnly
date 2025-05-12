import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError, logInfo } from "../../services/logging";

export const onReelBlacklist = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }
  try {
    logInfo("Blacklisted reel is uploaded.", {
      creatorId: uid,
      reelId: request.data.reelId,
    });
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to publish reel.");
  }
});
