import Stripe from "stripe";
import { logInfo } from "../../services/logging";
import { firestore } from "../../services/firebaseAdmin";

export async function handlePaymentMethodAttached(
  event: Stripe.PaymentMethodAttachedEvent
) {
  logInfo(event);
  const paymentMethod = event.data.object;
  const uid = paymentMethod.metadata?.firestoreUid;
  if (!uid) {
    throw new Error("No UID found in account metadata");
  }
  const creatorConnectId = event.account;

  const stripeUserDocRef = firestore.collection("stripe_users").doc(uid);

  const customerSnapshot = await stripeUserDocRef
    .collection("stripe_customers")
    .where("creatorConnectId", "==", creatorConnectId)
    .get();
  if (customerSnapshot.empty) {
    throw new Error(
      `User does not have a stripe customer in ${creatorConnectId} connected account`
    );
  }
  const customerDocId = customerSnapshot.docs[0].id;

  await stripeUserDocRef.collection("stripe_customers").doc(customerDocId).set(
    {
      paymentMethodId: paymentMethod.id,
    },
    { merge: true }
  );
}
