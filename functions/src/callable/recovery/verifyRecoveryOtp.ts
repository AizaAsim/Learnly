import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { updateUserRecoveryMethod } from "../../services/recovery";
import { verifyCode } from "../../services/twilio";

export const verifyRecoveryOtp = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  const { recoveryMethod, value, otp } = request.data;

  if (!recoveryMethod || !value) {
    throw new HttpsError(
      "invalid-argument",
      "RecoveryMethod and value required"
    );
  }

  if (!otp) {
    throw new HttpsError("invalid-argument", "OTP is required");
  }

  try {
    const result = await verifyCode(value, otp);

    if (!result.isValid) {
      throw new HttpsError("unauthenticated", result.message);
    }

    const isUpdated = await updateUserRecoveryMethod(
      uid,
      recoveryMethod,
      value
    );

    if (isUpdated) {
      return {
        isVerified: result.isValid,
        message: "Recovery method saved successfully",
      };
    } else {
      return { isVerified: false, message: "Recovery method cannot be added" };
    }
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Error sending OTP");
  }
});
