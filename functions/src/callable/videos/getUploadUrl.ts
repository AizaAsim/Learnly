import { HttpsError, onCall } from "firebase-functions/v2/https";
import { logError } from "../../services/logging";
import { createUploadUrl } from "../../services/mux";
import { corsOptions } from "../../config/corsOptions";

export const getUploadUrl = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }
    return createUploadUrl(uid);
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to fetch upload URL");
  }
});
