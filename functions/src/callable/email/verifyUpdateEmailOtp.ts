import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError, logInfo } from "../../services/logging";
import { verifyCode } from "../../services/twilio";
import { updateUserEmail } from "../../services/users";

export const verifyUpdateEmailOtp = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  const { email, otp } = request.data;

  if (!email || !otp) {
    throw new HttpsError("invalid-argument", "Email and OTP are required");
  }

  try {
    const result = await verifyCode(email, otp);

    if (!result.isValid) {
      logError(result.message);
      throw new HttpsError("unauthenticated", result.message);
    }

    const isVerifyingCurrentEmailOtp = email === request.auth?.token.email;

    if (isVerifyingCurrentEmailOtp) {
      logInfo("Current Email OTP verified successfully");
      return {
        isVerified: result.isValid,
        message: "Email OTP verified successfully",
      };
    }

    logInfo("New Email OTP verified successfully");

    await updateUserEmail(uid, email);

    logInfo("Email Updated Successfully");

    return {
      isVerified: result.isValid,
      message: "Email OTP verified successfully",
    };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Error verifying New Email OTP");
  }
});
