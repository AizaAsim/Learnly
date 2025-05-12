import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { saveUserLatestAgreement } from "../../services/termsOfService";

export const saveAgreement = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }
    const userLatest = await saveUserLatestAgreement(uid);
    return userLatest;
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to check user agreement");
  }
});
