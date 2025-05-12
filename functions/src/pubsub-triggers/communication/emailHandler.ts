import { logInfo } from "../../services/logging";
import { sendEmail } from "../../services/sendgrid";
import { EmailDynamicDataType, TopicData, TopicType } from "../../types/pubsub";

export const emailHandler = async (
  userId: string,
  props: TopicData<TopicType.COMMUNICATION>
) => {
  const data = props.data as EmailDynamicDataType;
  logInfo("Sending email", props, data);
  sendEmail({
    userId,
    data,
  });
};
