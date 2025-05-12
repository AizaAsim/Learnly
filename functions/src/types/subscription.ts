import { Timestamp } from "firebase-admin/firestore";

type SubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export interface UserSubscription {
  id: string;
  amount: number;
  cancelAt: Timestamp | null;
  cancelAtPeriodEnd: boolean;
  cancelledAt: Timestamp | null;
  creatorUid: string;
  currentPeriodEnd: Timestamp;
  currentPeriodStart: Timestamp;
  startDate: Timestamp;
  status: SubscriptionStatus;
  subscriberUid: string;
}

export interface Subscriber {
  id: string;
  subscriberId: string;
  creatorId: string;
  amount: number;
  status: SubscriptionStatus;
  startDate: Timestamp;
  latestSubscriptionId: string;
  subscriptionIds: string[];
  lifeTimeSpend: number;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAt: Timestamp | null;
  cancelledAt: Timestamp | null;
  cancelAtPeriodEnd: boolean;
  cancellationReason?: string;
  latestCharge: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  brand: string | null;
  expMonth: number | null;
  expYear: number | null;
  last4: string | null;
  cardholderName: string | null;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface Invoice {
  id: string;
  amountPaid: number;
  currency: string;
  hostedInvoiceUrl: string;
  invoicePdf: string;
  stripeCustomerId: string;
  creatorConnectId: string;
  subscriptionId: string;
  creatorUid: string;
  subscriberUid: string;
  paymentIntentId: string;
  paymentMethod: Pick<PaymentMethod, "brand" | "last4">;
  createdAt: Timestamp;
}

export interface SubscriptionCreationRequirements {
  userId: string;
  creatorUid: string;
  creatorConnectId: string;
  stripeCustomerId: string;
  platformPaymentMethodId: string;
  subscriptionPrice: number;
  productId: string;
  userDisplayname?: string;
}

export interface StripeCustomer {
  stripeCustomerId: string;
  creatorConnectId: string;
  creatorId: string;
  paymentMethodId: string;
}

export interface ConnectedPaymentMethod {
  connectCustomerId: string;
  connectPaymentMethod: string;
  creatorConnectId: string;
  platformPaymentMethodId: string;
}
