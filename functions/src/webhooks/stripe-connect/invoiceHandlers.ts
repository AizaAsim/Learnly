import Stripe from "stripe";
import { logInfo } from "../../services/logging";
import { firestore } from "../../services/firebaseAdmin";
import { convertUnixToFirestoreTimestamp } from "../../shared/helpers/utils";
import { getPaymentIntent } from "../../services/stripe";
import { FieldValue } from "firebase-admin/firestore";
import { sendNotification } from "../../services/notifications";
import { getUser } from "../../services/users";
import {
  InAppNotificationIconType,
  InAppNotificationType,
} from "../../types/pubsub";

export async function handleInvoicePaid(event: Stripe.InvoicePaidEvent) {
  logInfo(event);
  const invoice = event.data.object;
  const creatorConnectId = event.account;
  const paymentIntentId = invoice.payment_intent;
  if (!paymentIntentId && invoice.amount_paid === 0) {
    logInfo(
      `No payment intent found in invoice ${invoice.id} as it is for trial added for billing cycle adjustment.`
    );
    return;
  }
  const paymentIntent = await getPaymentIntent(
    paymentIntentId as string,
    creatorConnectId,
    ["payment_method"]
  );
  const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod;
  const subscriptionId = invoice.subscription;
  const creatorUid = invoice.lines.data[0].metadata.creatorUid;
  const subscriberUid = invoice.lines.data[0].metadata.subscriberUid;

  // Update the subscriber document
  const subscriberRef = firestore
    .collection("learners")
    .doc(`${creatorUid}_${subscriberUid}`);

  await subscriberRef.update({
    lifeTimeSpend: FieldValue.increment(invoice.amount_paid),
    latestCharge: invoice.charge,
  });

  // Create the invoice document
  await firestore
    .collection("invoices")
    .doc(invoice.id)
    .set({
      id: invoice.id,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency,
      createdAt: convertUnixToFirestoreTimestamp(invoice.created),
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      stripeCustomerId: invoice.customer,
      creatorConnectId,
      subscriptionId,
      creatorUid,
      subscriberUid,
      paymentIntentId,
      chargeId: invoice.charge,
      paymentMethod: {
        id: paymentMethod.id,
        brand: paymentMethod.card?.brand,
        last4: paymentMethod.card?.last4,
      },
      deletedAt: null,
    });
}

export async function handleInvoicePaymentFailed(
  event: Stripe.InvoicePaymentFailedEvent
) {
  logInfo(event);
  const invoice = event.data.object;
  const metadata = invoice.subscription_details?.metadata;
  const subscriberUid = metadata?.subscriberUid;
  const creatorUid = metadata?.creatorUid;
  if (subscriberUid && creatorUid) {
    const creator = await getUser(creatorUid);
    // Sends Notification of failed payment to user
    const notificationData = {
      title: creator?.displayName || creator?.username || "Educator",
      type: InAppNotificationType.USER_PAYMENT_FAILED,
      iconType: InAppNotificationIconType.STORAGE,
      message: "Subscripton payment failed.",
      iconStorageUrl: creator?.avatar_url,
      metadata: {
        userId: subscriberUid,
        creatorId: creatorUid,
        creatorUsername: creator?.username,
      },
    };

    await sendNotification({
      to: subscriberUid,
      data: notificationData,
    });
  }
}
