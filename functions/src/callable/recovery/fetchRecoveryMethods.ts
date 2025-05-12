import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getUserRecoveryMethods } from "../../services/recovery";

export const fetchRecoveryMethods = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  try {
    const userRecoveryMethods = await getUserRecoveryMethods(uid);

    return userRecoveryMethods;
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Error retrieving recovery method");
  }
});
