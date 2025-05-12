import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { ChannelTypes, CodeTemplates, sendCode } from "../../services/twilio";

export const sendOtp = onCall(corsOptions, async (request) => {
  const { email } = request.data;

  if (!email) {
    throw new HttpsError("invalid-argument", "Email is required");
  }

  try {
    const channel = ChannelTypes.EMAIL;
    const template = CodeTemplates.SIGN_IN;

    // const result = await sendCode(email, channel, template);

    return { success: true, message: "yeah" };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Invalid email address");
  }
});
