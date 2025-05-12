import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getStripeDoc, payInvoice } from "../../services/stripe";
import { getLatestInvoice, getSubscriber } from "../../services/subscription";
import Stripe from "stripe";

export const retrySubscriptionPayment = onCall(corsOptions, async (request) => {
  try {
    const userId = request.auth?.uid;
    if (!userId) {
      throw new HttpsError("unauthenticated", "User is not authenticated.");
    }
    const creatorId = request.data.creatorId;
    if (!creatorId) {
      throw new HttpsError("invalid-argument", "Educator ID is required.");
    }
    const stripeDoc = await getStripeDoc(creatorId);

    if (!stripeDoc) {
      throw new HttpsError(
        "failed-precondition",
        "Educator does not have a Stripe account set."
      );
    }

    const creatorConnectId = stripeDoc.stripeConnectId;

    const subscriber = await getSubscriber(creatorId, userId);

    if (!subscriber) {
      throw new HttpsError("not-found", "Subscription not found.");
    }

    const subscriptionId = subscriber.latestSubscriptionId;

    const latestInvoice = await getLatestInvoice(
      subscriptionId,
      stripeDoc.stripeConnectId
    );

    if (!latestInvoice) {
      throw new HttpsError("not-found", "Invoice not found.");
    }

    if (latestInvoice.status !== "open") {
      throw new HttpsError(
        "failed-precondition",
        "Invoice is not in a retriable state."
      );
    }

    const invoice = await payInvoice(
      latestInvoice.id,
      undefined,
      creatorConnectId
    );

    return { invoiceId: invoice.id };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    else if (error instanceof Stripe.errors.StripeError)
      throw new HttpsError("internal", error.message);
    else throw new HttpsError("internal", "Failed to retry payment");
  }
});
