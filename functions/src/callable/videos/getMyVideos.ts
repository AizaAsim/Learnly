import { HttpsError, onCall } from "firebase-functions/v2/https";
import { logError } from "../../services/logging";
import { corsOptions } from "../../config/corsOptions";
import { getUserRole } from "../../services/users";
import { getMyVideoData } from "../../services/creatorVideos";

export const getMyVideos = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }

    const role = await getUserRole(uid);
    if (role !== "creator") {
      throw new HttpsError("permission-denied", "User is not a creator");
    }

    return getMyVideoData(uid);
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to fetch upload URL");
  }
});
