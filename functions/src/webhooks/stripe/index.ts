import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { logError, logInfo } from "../../services/logging";
import { verifyAndConstructWebhookEvent } from "../../services/stripe";
import { handleSetupIntentSucceeded } from "./intentHandlers";
import {
  handlePaymentMethodAttached,
  handlePaymentMethodDetached,
} from "./paymentMethodHandlers";
import { handleCustomerUpdated } from "./customerHandlers";

export const stripe = onRequest(async (request, response) => {
  try {
    const event = verifyAndConstructWebhookEvent(request, false);

    switch (event.type) {
      case "setup_intent.succeeded":
        await handleSetupIntentSucceeded(event);
        break;
      case "payment_method.attached":
        await handlePaymentMethodAttached(event);
        break;
      case "payment_method.detached":
        await handlePaymentMethodDetached(event);
        break;
      case "customer.updated":
        await handleCustomerUpdated(event);
        break;
      default:
        handleEventMiss(event);
    }

    response.status(200).send();
    return;
  } catch (error) {
    logError(error);
    response.status(500).send("Something went wrong!");
  }
});

function handleEventMiss(event: Stripe.Event) {
  logInfo(
    `No handler set up for type ${event.type} but received webhook event.`
  );
}
