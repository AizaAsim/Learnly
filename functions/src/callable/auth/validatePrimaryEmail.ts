import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { getUserByEmail } from "../../services/users";
import { getMaskedUserRecoveryMethods } from "../../services/recovery";

export const validatePrimaryEmail = onCall(corsOptions, async (request) => {
  try {
    const { email } = request.data;
    if (!email) {
      throw new HttpsError("invalid-argument", "Email is required");
    }
    const user = await getUserByEmail(email);

    if (user?.id) {
      const userRecoveryMethods = await getMaskedUserRecoveryMethods(user?.id);

      return {
        isValid: true,
        recovery: {
          phone: userRecoveryMethods.recoveryPhone,
          email: userRecoveryMethods.recoveryEmail,
        },
      };
    } else {
      return { isValid: false };
    }
  } catch (error) {
    throw new HttpsError("internal", "Failed to check primary email");
  }
});
