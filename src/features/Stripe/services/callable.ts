import { functions } from "@/services/firebase";
import { httpsCallable } from "firebase/functions";

export const getStripeOnboardingLink = httpsCallable<void, { url: string }>(
  functions,
  "stripe-getOnboardingLink"
);

export const createSubscription = httpsCallable<
  { creatorUid: string },
  { subscriptionId: string }
>(functions, "stripe-createSubscriptionToCreator");

export const saveCustomerCard = httpsCallable<
  { creatorId?: string },
  { client_secret: string }
>(functions, "stripe-saveCustomerCard");

export const deleteCustomerCard = httpsCallable<
  { paymentMethodId: string },
  { paymentMethodId: string }
>(functions, "stripe-deleteCustomerCard");

export const makeCustomerCardDefault = httpsCallable<
  { paymentMethodId: string },
  { paymentMethodId: string }
>(functions, "stripe-makeCustomerCardDefault");

export const unsubscribeCreator = httpsCallable<
  { creatorId: string },
  { subscription: string }
>(functions, "stripe-unsubscribe");

export const getCreatorSubscriptionInfo = httpsCallable<
  { creatorUsername: string },
  {
    subscriptionPrice: number;
    isSubscriptionActivated: boolean;
    isSubscribed: boolean;
    cancelAtPeriodEnd: boolean;
    isPastDue: boolean;
    isCreatorAccountDeleted: boolean;
  }
>(functions, "stripe-getCreatorSubscriptionInfo");

export const resumeSubscription = httpsCallable<
  { creatorId: string },
  { subscriptionId: string }
>(functions, "stripe-resumeSubscription");

export const retrySubscriptionPayment = httpsCallable<
  { creatorId: string },
  { invoiceId: string }
>(functions, "stripe-retrySubscriptionPayment");
