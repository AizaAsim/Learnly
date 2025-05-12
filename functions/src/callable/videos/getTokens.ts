import { HttpsError, onCall } from "firebase-functions/v2/https";
import { logError, logInfo } from "../../services/logging";
import { corsOptions } from "../../config/corsOptions";
import { getVideoTokens } from "../../services/mux";

function isAuthorized(userId: string, videoId: string) {
  logInfo(`Checking if user ${userId} is authorized to view video ${videoId}`);
  // TODO: We need to hook into the Auth/Payment system to validate request
  // and only generate tokens for customers and owner.
  return true;
}

export const getTokens = onCall(corsOptions, async (request) => {
  const videoId = request.data.videoId;
  const userId = request.auth?.uid;
  if (!userId || !isAuthorized(userId, videoId)) {
    throw new HttpsError(
      "permission-denied",
      "You are not authorized to view this content."
    );
  }
  try {
    const tokens = await getVideoTokens(videoId);
    return tokens;
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to fetch upload URL");
  }
});
