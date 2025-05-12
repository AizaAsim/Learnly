import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { getUserByEmail } from "../../services/users";
import { getUserRecoveryMethods } from "../../services/recovery";
import { RecoveryMethods } from "../../types/recoveryMethods";
import { ChannelTypes, CodeTemplates, sendCode } from "../../services/twilio";

export const sendAuthRecoveryOtp = onCall(corsOptions, async (request) => {
  const { recoveryMethod, primaryEmail } = request.data;

  if (!recoveryMethod || !primaryEmail) {
    throw new HttpsError(
      "invalid-argument",
      "RecoveryMethod and Email are required"
    );
  }

  let value = request.data?.value;

  try {
    const user = await getUserByEmail(primaryEmail);
    if (!user) {
      throw new HttpsError("not-found", "User not found");
    }
    const uid = user.id;

    const { recoveryEmail, recoveryPhone } = await getUserRecoveryMethods(uid);

    if (recoveryMethod === RecoveryMethods.PHONE) {
      if (value && recoveryPhone !== value) {
        throw new HttpsError(
          "unauthenticated",
          "Recovery method doesn't match"
        );
      }
    }

    if (recoveryMethod === RecoveryMethods.EMAIL && !value) {
      if (!recoveryEmail) {
        throw new HttpsError(
          "unauthenticated",
          "Recovery method doesn't match"
        );
      }
      value = recoveryEmail;
    }

    let channel,
      targetValue,
      template = null;

    switch (recoveryMethod) {
      case RecoveryMethods.EMAIL:
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
      recipient: targetValue,
    };
  } catch (error) {
    throw new HttpsError("internal", "Error sending OTP");
  }
});
