import { HttpsError, onCall } from "firebase-functions/v2/https";
import { logError } from "../../services/logging";
import { corsOptions } from "../../config/corsOptions";
import { updateUserData } from "../../services/users";

export const updateUser = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }
    return await updateUserData(uid, request.data);
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to update user");
  }
});
