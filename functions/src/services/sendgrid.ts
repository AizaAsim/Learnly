import sendgrid from "@sendgrid/mail";
import { logError, logInfo } from "./logging";
import { HttpsError } from "firebase-functions/v2/https";
import { EmailDynamicDataType } from "../types/pubsub";
import { getEmail } from "../shared/helpers/utils";

interface SendEmailProps {
  userId: string;
  data: EmailDynamicDataType;
}

const TEMPLATE_ID = "d-690913eae2b54270923783571d889005";

export const sendEmail = async ({ userId, data }: SendEmailProps) => {
  const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = process.env;

  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    logError("SENDGRID_API_KEY or SENDGRID_FROM_EMAIL is not set.");
    throw new HttpsError("internal", "Something went wrong!");
  }

  sendgrid.setApiKey(SENDGRID_API_KEY);

  try {
    const email = await getEmail(userId);

    const subject = getEmailSubject(data.type);

    const msg = {
      to: email,
      from: SENDGRID_FROM_EMAIL,
      subject: `LEARNLY | ${subject}`,
      templateId: TEMPLATE_ID,
      dynamicTemplateData: {
        ...data,
      },
    };

    await sendgrid.send(msg);
    logInfo(`Email sent successfully to ${email}`);
  } catch (error) {
    logError(error);
    throw new Error("Error sending email");
  }
};

const getEmailSubject = (type: string) => {
  const allParams = Object.values(type).join("");
  const pageNameWithSpaces = allParams.replace(/_/g, " ");
  return pageNameWithSpaces
    .split(" ")
    .map((word) =>
      word.length > 1 ? word[0].toUpperCase() + word.slice(1) : word
    )
    .join(" ");
};
