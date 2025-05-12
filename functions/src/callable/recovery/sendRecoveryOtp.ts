import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { RecoveryMethods } from "../../types/recoveryMethods";
import { logError } from "../../services/logging";
import { ChannelTypes, CodeTemplates, sendCode } from "../../services/twilio";

export const sendRecoveryOtp = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  const { recoveryMethod, value } = request.data;

  if (!recoveryMethod || !value) {
    throw new HttpsError(
      "invalid-argument",
      "Both recovery method and value are required."
    );
  }

  try {
    let channel,
      targetValue,
      template = null;

    switch (recoveryMethod) {
      case RecoveryMethods.EMAIL:
        if (value === request.auth?.token?.email) {
          return {
            isValid: false,
            message: "Recovery email cannot be the same as the primary email.",
          };
        }
        channel = ChannelTypes.EMAIL;
        template = CodeTemplates.RECOVERY_EMAIL;
        targetValue = value;
        break;

      case RecoveryMethods.PHONE:
        channel = ChannelTypes.SMS;
        targetValue = value;
        break;

      default:
        throw new HttpsError(
          "invalid-argument",
          "Invalid recovery method. Allowed values are EMAIL or PHONE."
        );
    }

    const result = template
      ? await sendCode(targetValue, channel, template)
      : await sendCode(targetValue, channel);

    return {
      isValid: result?.success,
      message: result.message,
    };
  } catch (error) {
    logError(error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError("internal", "An error occurred while sending OTP.");
  }
});
