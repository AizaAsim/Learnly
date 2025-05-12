import { TopicData, TopicType } from "../../types/pubsub";
import { logError, logInfo } from "../../services/logging";
import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { parseCloudEventMessage } from "../../shared/helpers/pubsub";
import { emailHandler } from "./emailHandler";
import { notificationHandler } from "./notificationHandler";
import { smsHandler } from "./smsHandler";

/**
 * ALL our handlers need to be able to handle multiple users at once
 * It is not the responsibility of the handler to determine which user to send the communication to
 * This function just wraps the handler and sends the message to the user or users
 * @param props - The data and metadata of the communication
 */
const sendMessage = async (
  props: TopicData<TopicType.COMMUNICATION>,
  senderFn: (userId: string, props: TopicData<TopicType.COMMUNICATION>) => void
) => {
  const userIds =
    typeof props.metadata.to === "string"
      ? [props.metadata.to]
      : props.metadata.to;

  for (const userId of userIds) {
    logInfo(`Sending message to user ${userId}`);
    senderFn(userId, props);
  }
};

export const handleCommunicationEvent = onMessagePublished<
  TopicData<TopicType.COMMUNICATION>
>(TopicType.COMMUNICATION, async (event) => {
  try {
    const parsedEvent = parseCloudEventMessage(event);
    const { data, metadata } = parsedEvent;
    const { deliveryMethods } = metadata;

    const promises = [];
    for (const method of deliveryMethods) {
      switch (method) {
        case "in_app":
          promises.push(
            sendMessage(
              {
                data,
                metadata,
              },
              notificationHandler
            )
          );
          break;
        case "email":
          promises.push(
            sendMessage(
              {
                data,
                metadata,
              },
              emailHandler
            )
          );
          break;
        case "sms":
          promises.push(
            sendMessage(
              {
                data,
                metadata,
              },
              smsHandler
            )
          );
          break;
        default:
          logError(`Unknown delivery method: ${method}`);
      }
    }

    await Promise.all(promises);
  } catch (error) {
    logError("Error occurred while sending in-app notification", error);
  }
});
