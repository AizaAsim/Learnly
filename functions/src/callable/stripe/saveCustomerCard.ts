import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { firestore } from "../../services/firebaseAdmin";
import { logError } from "../../services/logging";
import { createSetupIntent, getStripeDoc } from "../../services/stripe";
import { createStripeCustomerAccount } from "../../services/stripeCustomers";
import { getUser } from "../../services/users";

export const saveCustomerCard = onCall(corsOptions, async (request) => {
  const userId = request.auth?.uid;
  if (!userId)
    throw new HttpsError("unauthenticated", "User is not authenticated.");
  try {
    const stripeUserDocRef = await firestore
      .collection("stripe_users")
      .doc(userId)
      .get();
    if (!stripeUserDocRef.exists) {
      throw new HttpsError(
        "failed-precondition",
        "User does not have a doc in stripe_users."
      );
    }

    const stripeUserDoc = stripeUserDocRef.data();
    const stripeCustomerId = stripeUserDoc?.stripeCustomerId;
    if (!stripeCustomerId) {
      throw new HttpsError(
        "failed-precondition",
        "User does not have a stripe customer."
      );
    }
    const setupIntent = await createSetupIntent(stripeCustomerId, userId);
    const creatorId = request.data?.creatorId;
    if (creatorId) {
      const stripeDoc = await getStripeDoc(creatorId);

      if (!stripeDoc) {
        throw new HttpsError(
          "failed-precondition",
          "Educator does not have a Stripe account set."
        );
      }
      const user = await getUser(userId);
      const customer = await createStripeCustomerAccount(
        userId,
        { name: user?.displayName },
        stripeDoc.stripeConnectId
      );
      await firestore
        .collection("stripe_users")
        .doc(userId)
        .collection("stripe_customers")
        .doc(creatorId)
        .set(
          {
            creatorConnectId: stripeDoc.stripeConnectId,
            stripeCustomerId: customer.id,
            creatorId,
          },
          { merge: true }
        );
    }

    const resp = { client_secret: setupIntent.client_secret };
    return resp;
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create setup intent");
  }
});
