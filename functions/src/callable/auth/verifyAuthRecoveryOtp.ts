import { HttpsError, onCall } from "firebase-functions/v2/https";
import { getUserByEmail } from "../../services/users";
import { corsOptions } from "../../config/corsOptions";
import { auth } from "../../services/firebaseAdmin";
import { verifyCode } from "../../services/twilio";

export const verifyAuthRecoveryOtp = onCall(corsOptions, async (request) => {
  try {
    const { recoveryMethod, otp, value, primaryEmail } = request.data;

    if (!recoveryMethod || !otp || !value || !primaryEmail) {
      throw new HttpsError(
        "invalid-argument",
        "RecoveryMethod, Value , Otp and Email are required"
      );
    }

    const result = await verifyCode(value, otp);
    if (!result.isValid) {
      throw new HttpsError("unauthenticated", result.message);
    }

    const user = await getUserByEmail(primaryEmail);
    if (!user?.id) {
      throw new HttpsError("not-found", "User not found");
    }

    const uid = user.id;
    const additionalClaims = {
      role: user?.role,
      isNewUser: false,
      isRecovered: true,
    };

    const customToken = await auth.createCustomToken(uid, additionalClaims);

    return {
      isVerified: result.isValid,
      token: customToken,
    };
  } catch (error) {
    throw new HttpsError("internal", "Error verifying OTP to recover account");
  }
});
