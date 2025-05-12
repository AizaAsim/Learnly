import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { cancelVideoUpload } from "../../services/mux";

export const cancelUpload = onCall(corsOptions, async (request) => {
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

    const upload = await cancelVideoUpload(uploadId);
    return upload;
  } catch (error) {
    logError(error);
    //TODO handle errors like The upload has already completed
    throw new HttpsError("internal", "Failed to cancel the uploading process");
  }
});
