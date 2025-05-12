import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { logError, logInfo } from "../../services/logging";
import { verifyAndConstructWebhookEvent } from "../../services/stripe";
import { handleAccountUpdated } from "./accountHandlers";
import { handlePaymentMethodAttached } from "./paymentMethodHandlers";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
} from "./subscriptionHandlers";
import {
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from "./invoiceHandlers";
import { handleChargeRefunded } from "./chargeHandlers";
import { handleCapabilityUpdated } from "./capabilityHandlers";

export const connectedStripe = onRequest(async (request, response) => {
  try {
    const event = verifyAndConstructWebhookEvent(request, true);

    switch (event.type) {
      case "account.updated":
        await handleAccountUpdated(event);
        break;
      case "payment_method.attached":
        await handlePaymentMethodAttached(event);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(event);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionUpdated(event, event.account);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event);
        break;
      case "capability.updated":
        await handleCapabilityUpdated(event);
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
    `No handler set up for type ${event.type} but received webhook event in the connected account ${event.account}.`
  );
}
