import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { checkUserAgreedToLatestTos } from "../../services/termsOfService";

export const getAgreement = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }
    const userAgreed = await checkUserAgreedToLatestTos(uid);
    return userAgreed;
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to check user agreement");
  }
});
