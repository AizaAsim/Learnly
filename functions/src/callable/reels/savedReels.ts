import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getSavedReels } from "../../services/savedReels";

export const savedReels = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;
  const { lastDocId } = request.data || {};

  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  try {
    const result = await getSavedReels({ uid, lastDocId });
    return result;
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to fetch reels.");
  }
});
