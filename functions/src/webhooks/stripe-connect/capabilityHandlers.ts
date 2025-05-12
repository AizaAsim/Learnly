import Stripe from "stripe";
import { firestore } from "../../services/firebaseAdmin";
import { logInfo } from "../../services/logging";

export async function handleCapabilityUpdated(
  event: Stripe.CapabilityUpdatedEvent
) {
  logInfo(event);
  const capability = event.data.object;
  const stripeConnectId = capability.account;

  const querySnapshot = await firestore
    .collection("stripe")
    .where("stripeConnectId", "==", stripeConnectId)
    .get();
  if (querySnapshot.empty) {
    throw new Error(
      `No stripe account found with stripeConnectId ${stripeConnectId}`
    );
  }
  const doc = querySnapshot.docs[0];
  const docData = doc.data();
  if (!docData.isOnboardingStarted) {
    await doc.ref.update({
      isOnboardingStarted: true,
    });
  }
}
