import { Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";

export interface StripeAccountDoc {
  charges_enabled: boolean;
  isOnboardingStarted: boolean;
  hasShownActivationModal: boolean;
  payouts_enabled: boolean;
  stripeConnectId: string;
  requirements: Stripe.Account.Requirements;
  deletedAt: Timestamp | null;
}
