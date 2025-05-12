import { HttpsError, onCall } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { corsOptions } from "../../config/corsOptions";
import { firestore } from "../../services/firebaseAdmin";
import { logError } from "../../services/logging";
import { createSubscription, payInvoice } from "../../services/stripe";
import {
  getCustomerDoc,
  createStripeCustomerAccount,
  setupCustomerPaymentMethodInConnectedAccount,
  checkExistingConnectedPaymentMethod,
} from "../../services/stripeCustomers";
import {
  addSubscriptionDocuments,
  checkUserSubscribeToCreator,
  validateSubscriptionRequirements,
} from "../../services/subscription";

export const createSubscriptionToCreator = onCall(
  corsOptions,
  async (request) => {
    try {
      const {
        userId,
        creatorUid,
        creatorConnectId,
        stripeCustomerId,
        platformPaymentMethodId,
        subscriptionPrice,
        productId,
        userDisplayname,
      } = await validateSubscriptionRequirements(request);

      //check if already subscribed
      const { isSubscribed } = await checkUserSubscribeToCreator(
        creatorUid,
        userId
      );
      if (isSubscribed) {
        throw new HttpsError(
          "failed-precondition",
          "User is already subscribed."
        );
      }

      // Get or create customer in creator's connected account
      const customerDoc = await getCustomerDoc(creatorUid, userId);
      let customerId = customerDoc?.stripeCustomerId;

      if (!customerId) {
        const { id: newCustomerId } = await createStripeCustomerAccount(
          userId,
          { name: userDisplayname },
          creatorConnectId
        );
        const stripeUserDocRef = firestore
          .collection("stripe_users")
          .doc(userId);
        await stripeUserDocRef
          .collection("stripe_customers")
          .doc(creatorUid)
          .set({
            stripeCustomerId: newCustomerId,
            creatorId: creatorUid,
            creatorConnectId,
          });
        customerId = newCustomerId;
      }

      // Check if payment method already exists in connected account
      const existingPaymentMethod = await checkExistingConnectedPaymentMethod(
        userId,
        creatorConnectId,
        platformPaymentMethodId
      );

      // Get or create payment method in connected account
      const clonedPaymentMethod = existingPaymentMethod
        ? { id: existingPaymentMethod.connectPaymentMethod }
        : await setupCustomerPaymentMethodInConnectedAccount(
            platformPaymentMethodId,
            stripeCustomerId,
            creatorConnectId,
            userId,
            customerId,
            creatorUid
          );

      // Create subscription
      const subscription = await createSubscription(
        customerId,
        subscriptionPrice * 100,
        productId,
        creatorUid,
        creatorConnectId,
        userId
      );

      // Pay invoice if open
      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      if (latestInvoice.status === "open") {
        await payInvoice(
          latestInvoice.id,
          clonedPaymentMethod.id,
          creatorConnectId
        );
      }

      // Add subscription documents
      await addSubscriptionDocuments(subscription);
      return { subscriptionId: subscription.id };
    } catch (error) {
      logError(error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create Subscription.");
    }
  }
);
