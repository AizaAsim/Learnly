import { HttpsError } from "firebase-functions/https";
import { logError } from "./logging";
import { Twilio } from "twilio";

export enum ChannelTypes {
  SMS = "sms",
  EMAIL = "email",
}

export type ChannelType = ChannelTypes;

export enum CodeTemplates {
  SIGN_IN = "SIGN_IN",
  UPDATE_EMAIL = "UPDATE_EMAIL",
  RECOVERY_EMAIL = "RECOVERY_EMAIL",
}

export type Template = CodeTemplates;

export function getTwilioVerifyService() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } =
    process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    throw new HttpsError("internal", "Something went wrong!");
  }

  const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  return client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID);
}

export function getChannelConfig(template: Template) {
  const expiration_time = "15";

  const templateTitles = {
    [CodeTemplates.SIGN_IN]: {
      title: "Here's Your Sign In Code",
      description: "Copy and paste the code below to sign in to your account.",
    },
    [CodeTemplates.UPDATE_EMAIL]: {
      title: "Confirm Your Email Change",
      description:
        "Use the code below to verify your request to update the email associated with your account.",
    },
    [CodeTemplates.RECOVERY_EMAIL]: {
      title: "Confirm Your Recovery Email",
      description:
        "Copy and paste the code below to verify your recovery email address.",
    },
  };

  return {
    substitutions: {
      ...templateTitles[template],
      expiration_time,
    },
  };
}

export async function sendCode(
  to: string,
  channel: ChannelType,
  template?: Template
) {
  try {
    const twilioVerifyService = getTwilioVerifyService();

    if (channel === ChannelTypes.SMS) {
      await twilioVerifyService.verifications.create({
        channel,
        to,
        rateLimits: {
          recipient: to,
        },
      });

      return { success: true, message: "SMS code sent successfully" };
    }

    if (channel === ChannelTypes.EMAIL && template) {
      await twilioVerifyService.verifications.create({
        channel,
        to,
        channelConfiguration: getChannelConfig(template),
        rateLimits: {
          recipient: to,
        },
      });

      return { success: true, message: "Email code sent successfully" };
    }

    throw new HttpsError("invalid-argument", "Unsupported channel type.");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      logError("Error sending verification code:", error);
      if (error.code === 60203) {
        logError("!!! RATE LIMIT REACHED !!!");
        return {
          success: false,
          message: "Rate limit reached. Please try again later.",
        };
      } else throw error;
    }
    throw error;
  }
}

export async function verifyCode(to: string, code: string) {
  try {
    const twilioVerifyService = getTwilioVerifyService();

    const verificationCheck =
      await twilioVerifyService.verificationChecks.create({
        to,
        code,
      });

    return {
      isValid: verificationCheck.valid,
      message: verificationCheck.valid
        ? "Verification succeeded"
        : "Invalid code",
    };
  } catch (error) {
    logError("Verification check failed:", error);
    return { isValid: false, message: "Verification failed" };
  }
}
