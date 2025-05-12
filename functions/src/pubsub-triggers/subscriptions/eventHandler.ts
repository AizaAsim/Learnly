import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { SubscriptionAction, TopicData, TopicType } from "../../types/pubsub";
import { parseCloudEventMessage } from "../../shared/helpers/pubsub";
import { addHandler } from "./addHandler";
import { updateHandler } from "./updateHandler";
import { logWarning } from "../../services/logging";

export const handleSubscriptionEvent = onMessagePublished<
  TopicData<TopicType.SUBSCRIPTION>
>(TopicType.SUBSCRIPTION, async (event) => {
  const parsedEvent = parseCloudEventMessage(event);
  const { data, metadata } = parsedEvent;
  const { action } = metadata;

  switch (action) {
    case SubscriptionAction.CREATE:
      await addHandler(data);
      break;
    case SubscriptionAction.UPDATE:
      await updateHandler(data);
      break;
    default:
      logWarning("Unknown subscription action", parsedEvent);
  }
});
