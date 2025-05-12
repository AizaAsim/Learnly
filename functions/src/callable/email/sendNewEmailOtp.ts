import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getUserByEmail } from "../../services/users";
import { ChannelTypes, CodeTemplates, sendCode } from "../../services/twilio";
import { validateRecoveryMethod } from "../../services/recovery";
import { RecoveryMethods } from "../../types/recoveryMethods";

export const sendNewEmailOtp = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  const { email } = request.data;

  if (!email) {
    throw new HttpsError("invalid-argument", "Email is required");
  }

  if (email === request.auth?.token.email) {
    return {
      isValid: false,
      message: "New Email is same as Current Email",
    };
  }

  try {
    const userAlreadyExists = await getUserByEmail(email);

    const isUserRecoveryEmail = await validateRecoveryMethod(
      uid,
      RecoveryMethods.EMAIL,
      email
    );

    if (userAlreadyExists || isUserRecoveryEmail) {
      throw new HttpsError(
        "already-exists",
        "An account already exists for this email."
      );
    }

    const channel = ChannelTypes.EMAIL;
    const template = CodeTemplates.UPDATE_EMAIL;

    const result = await sendCode(email, channel, template);

    return {
      isValid: result.success,
      message: result.message,
    };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Error sending email");
  }
});
