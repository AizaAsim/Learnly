import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { TopicData, TopicType, UserAction } from "../../types/pubsub";
import { parseCloudEventMessage } from "../../shared/helpers/pubsub";
import { logWarning } from "../../services/logging";
import { softDeleteUserHandler } from "./softDeleteUserHandler";
import { softDeleteCreatorHandler } from "./softDeleteCreatorHandler";

export const handleUserActionEvent = onMessagePublished<
  TopicData<TopicType.USER_ACTION>
>(TopicType.USER_ACTION, async (event) => {
  const parsedEvent = parseCloudEventMessage(event);
  const { data, metadata } = parsedEvent;
  const { action } = metadata;

  switch (action) {
    case UserAction.SOFT_DELETE_CREATOR:
      await softDeleteCreatorHandler(data);
      break;
    case UserAction.SOFT_DELETE_USER:
      await softDeleteUserHandler(data);
      break;
    default:
      logWarning("Unknown subscription action", parsedEvent);
  }
});
