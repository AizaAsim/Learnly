import { Timestamp } from "firebase-admin/firestore";
import { getStripeInstance } from "./stripe";

export const calculateProratedRefund = (
  subscriptionAmount: number,
  periodStart: Timestamp,
  periodEnd: Timestamp
) => {
  const now = Date.now();
  const start = periodStart.toDate().getTime();
  const end = periodEnd.toDate().getTime();

  const totalBillingPeriodMs = end - start;
  const remainingBillingPeriodMs = Math.max(0, end - now);

  const refundRatio = remainingBillingPeriodMs / totalBillingPeriodMs;
  const refundAmount = Math.round(subscriptionAmount * refundRatio);

  return refundAmount;
};

export const createRefund = async (
  chargeId: string,
  amount: number,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const refund = await stripe.refunds.create(
    { charge: chargeId, amount },
    { stripeAccount: creatorConnectId }
  );
  return refund;
};
