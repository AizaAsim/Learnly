import Stripe from "stripe";
import { publishMessage } from "../../shared/helpers/pubsub";
import { SubscriptionAction, TopicType } from "../../types/pubsub";
import { logInfo } from "../../services/logging";

export async function handleSubscriptionCreated(
  event: Stripe.CustomerSubscriptionCreatedEvent
) {
  const subscription = event.data.object;
  logInfo("Subscription added: ", subscription);
  await publishMessage(TopicType.SUBSCRIPTION, {
    data: { subscription },
    metadata: { action: SubscriptionAction.CREATE },
  });
}

export async function handleSubscriptionUpdated(
  event:
    | Stripe.CustomerSubscriptionUpdatedEvent
    | Stripe.CustomerSubscriptionDeletedEvent,
  account?: string
) {
  const subscription = event.data.object;
  logInfo("Subscription updated: ", subscription);
  await publishMessage(TopicType.SUBSCRIPTION, {
    data: { subscription, account },
    metadata: { action: SubscriptionAction.UPDATE },
  });
}
