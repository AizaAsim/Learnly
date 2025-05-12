import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { ChannelTypes, CodeTemplates, sendCode } from "../../services/twilio";

export const sendCurrentEmailOtp = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;
  const email = request.auth?.token.email;

  if (!uid || !email) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  try {
    const channel = ChannelTypes.EMAIL;
    const template = CodeTemplates.UPDATE_EMAIL;

    const result = await sendCode(email, channel, template);

    return {
      success: result.success,
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
