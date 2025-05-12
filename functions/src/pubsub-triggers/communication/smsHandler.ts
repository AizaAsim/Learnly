import { logInfo } from "../../services/logging";
import { getPhoneNumber } from "../../shared/helpers/utils";
import { SmsDataType, TopicData, TopicType } from "../../types/pubsub";

export const smsHandler = async (
  userId: string,
  props: TopicData<TopicType.COMMUNICATION>
) => {
  const sms = await getPhoneNumber(userId);
  const data = props.data as SmsDataType;
  logInfo("Sending sms", props, sms, data);
  // TODO: Implement this function
};
