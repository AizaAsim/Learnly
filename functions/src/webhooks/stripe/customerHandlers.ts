import Stripe from "stripe";
import { firestore } from "../../services/firebaseAdmin";
import { StripeCustomer } from "../../types/subscription";
import { updateStripeCustomer } from "../../services/stripeCustomers";
import { logError, logInfo } from "../../services/logging";

export const handleCustomerUpdated = async (
  event: Stripe.CustomerUpdatedEvent
) => {
  const customer = event.data.object;
  const uid = customer.metadata?.firestoreUid;

  if (!uid) {
    throw new Error("No user id in metadata");
  }

  const customerName = customer.name;

  if (!customerName) {
    logError("No name in customer object", { uid });
    return;
  }

  const stripeUserDocRef = firestore
    .collection("stripe_users")
    .doc(uid)
    .collection("stripe_customers");

  // loop through all the docs and update the customer name in all connected accounts
  const stripeCustomersSnapshot = await stripeUserDocRef.get();
  if (stripeCustomersSnapshot.empty) {
    logInfo(`No connected Stripe customers found for user ${uid}.`);
    return;
  }

  const updatePromises = stripeCustomersSnapshot.docs.map(
    async (customerDoc) => {
      const stripeCustomer = customerDoc.data() as StripeCustomer;

      try {
        await updateStripeCustomer(
          stripeCustomer.stripeCustomerId,
          {
            name: customerName,
          },
          stripeCustomer.creatorConnectId
        );
        logInfo(
          `Stripe customer ${stripeCustomer.stripeCustomerId} name updated in connected account ${stripeCustomer.creatorConnectId}.`
        );
      } catch (error) {
        logError(
          `Failed to update Stripe customer ${stripeCustomer.stripeCustomerId}.`,
          {
            creatorConnectId: stripeCustomer.creatorConnectId,
            error,
          }
        );
      }
    }
  );

  await Promise.all(updatePromises);

  logInfo(`Successfully updated all Stripe customers for user ${uid}.`);
};
