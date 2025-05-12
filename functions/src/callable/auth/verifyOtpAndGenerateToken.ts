import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { verifyCode } from "../../services/twilio";
import { auth } from "../../services/firebaseAdmin";
import { getUserByEmail } from "../../services/users";
import { v4 as uuidv4 } from "uuid";

export const verifyOtpAndGenerateToken = onCall(
  corsOptions,
  async (request) => {
    const { email, otp, role } = request.data;

    if (!email || !otp || !role) {
      throw new HttpsError(
        "invalid-argument",
        "Email, OTP and Role are required"
      );
    }

    try {
      // Verify the OTP
      const result = await verifyCode(email, otp);

      if (!result.isValid) {
        throw new HttpsError("unauthenticated", result.message);
      }

      // Check if the user exists
      const user = await getUserByEmail(email);

      const uid = user?.id || uuidv4();

      const additionalClaims = {
        role,
        isNewUser: user?.id ? false : true,
      };

      const customToken = await auth.createCustomToken(uid, additionalClaims);

      return { token: customToken };
    } catch (error) {
      logError("Error in verifyOtpAndGenerateToken:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        "Error verifying OTP and generating token"
      );
    }
  }
);
