import Stripe from "stripe";
import { firestore } from "../../services/firebaseAdmin";
import { Subscriber } from "../../types/subscription";
import { FieldValue } from "firebase-admin/firestore";

export async function handleChargeRefunded(event: Stripe.ChargeRefundedEvent) {
  const charge = event.data.object;
  // retrieve subscription based on charge id
  const userSubscriptionRef = firestore.collection("learners");
  const userSubscriptionSnapshot = await userSubscriptionRef
    .where("latestCharge", "==", charge.id)
    .get();
  if (userSubscriptionSnapshot.empty)
    throw new Error(
      `Subscription associated with charge ${charge.id} not found`
    );

  const subscription = userSubscriptionSnapshot.docs[0].data() as Subscriber;
  const amountRefunded = charge.amount_refunded;
  await userSubscriptionRef.doc(subscription.id).update({
    lifeTimeSpend: FieldValue.increment(-amountRefunded),
  });
}
