import { getOnboardingLink } from "./getOnboardingLink";
import { createSubscriptionToCreator } from "./createSubscriptionToCreator";
import { saveCustomerCard } from "./saveCustomerCard";
import { unsubscribe } from "./unsubscribe";
import { getCreatorSubscriptionInfo } from "./getCreatorSubscriptionInfo";
import { resumeSubscription } from "./resumeSubscription";
import { deleteCustomerCard } from "./deleteCustomerCard";
import { makeCustomerCardDefault } from "./makeCustomerCardDefault";
import { retrySubscriptionPayment } from "./retrySubscriptionPayment";

export const stripe = {
  getOnboardingLink,
  createSubscriptionToCreator,
  saveCustomerCard,
  unsubscribe,
  getCreatorSubscriptionInfo,
  resumeSubscription,
  deleteCustomerCard,
  makeCustomerCardDefault,
  retrySubscriptionPayment,
};
