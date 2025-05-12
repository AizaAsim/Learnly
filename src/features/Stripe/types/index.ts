import { FirebaseTimestamp } from "@/types";
import { Timestamp } from "firebase/firestore";

export interface PaymentMethod {
  id: string;
  type: string;
  brand: string;
  expMonth: number;
  expYear: number;
  last4: string;
  cardholderName: string;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface StripeUserData {
  activePaymentMethodId: string | null;
  deletedAt: Timestamp | null;
  stripeCustomerId: string;
}

export interface StripeConnectOnboardError {
  code: string;
  reason: string;
  requirement: string;
  detailed_code: string;
}
export interface CreatorStripeData {
  stripeConnectId: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements: {
    currently_due: string[];
    past_due: string[];
    pending_verification: string[];
    errors: StripeConnectOnboardError[];
    current_deadline: number | null;
  };
  isOnboardingStarted: boolean;
  hasShownActivationModal: boolean;
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
  cancelAt: FirebaseTimestamp | null;
  cancelAtPeriodEnd: boolean;
  cancelledAt: FirebaseTimestamp | null;
  creatorUid: string;
  currentPeriodEnd: FirebaseTimestamp;
  currentPeriodStart: FirebaseTimestamp;
  startDate: FirebaseTimestamp;
  status: SubscriptionStatus;
  subscriberUid: string;
}

export interface Subscriber {
  id: string;
  subscriberId: string;
  creatorId: string;
  amount: number;
  status: SubscriptionStatus;
  startDate: FirebaseTimestamp | Timestamp;
  latestSubscriptionId: string;
  subscriptionIds: string[];
  lifeTimeSpend: number;
  currentPeriodStart: FirebaseTimestamp | Timestamp;
  currentPeriodEnd: FirebaseTimestamp | Timestamp;
  cancelAt: FirebaseTimestamp | Timestamp | null;
  cancellationReason?: string;
  latestCharge: string;
}
