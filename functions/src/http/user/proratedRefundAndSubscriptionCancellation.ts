import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError, logInfo } from "../../services/logging";
import { calculateProratedRefund, createRefund } from "../../services/refund";
import { getStripeDoc } from "../../services/stripe";
import { cancelSubscription, getSubscriber } from "../../services/subscription";
import { AppError } from "../../shared/classes/AppError";

interface RequestBody {
  creatorId: string;
  userId: string;
}

export const proratedRefundAndSubscriptionCancellation = onRequest(
  corsOptions,
  async (request, response) => {
    const { creatorId, userId } = request.body as RequestBody;
    if (!creatorId || !userId) {
      response.status(400).send("Invalid request body");
      return;
    }
    logInfo(
      `Creating prorated refund and cancel subscription of creator ${creatorId} for user ${userId}`
    );
    try {
      const subscriber = await getSubscriber(creatorId, userId);

      if (!subscriber) {
        response.status(404).send("Subscriber not found");
        return;
      }

      if (!["active", "trialing"].includes(subscriber.status)) {
        response.status(200).send("Subscription is not active");
        return;
      }

      const refundAmount = calculateProratedRefund(
        subscriber.amount,
        subscriber.currentPeriodStart,
        subscriber.currentPeriodEnd
      );

      const creatorStripeDoc = await getStripeDoc(creatorId);

      if (!creatorStripeDoc) {
        response.status(404).send("Educator has no stripe account");
        return;
      }

      const refund = await createRefund(
        subscriber.latestCharge,
        refundAmount,
        creatorStripeDoc.stripeConnectId
      );

      await cancelSubscription(
        subscriber.latestSubscriptionId,
        creatorStripeDoc.stripeConnectId
      );

      response
        .status(200)
        .send(
          `Refund of ${refund.amount} created and subscription cancelled for creator ${creatorId} and user ${userId}`
        );
    } catch (error) {
      logError("Error cleaning up expired temp post:", error);
      if (error instanceof AppError)
        response.status(error.statusCode).send(error.message);
      else
        response
          .status(500)
          .send("Error creating prorated refund and cancelling subscription");
    }
  }
);
