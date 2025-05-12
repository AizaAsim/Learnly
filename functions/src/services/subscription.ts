import { FieldValue } from "firebase-admin/firestore";
import { convertUnixToFirestoreTimestamp } from "../shared/helpers/utils";
import {
  Subscriber,
  SubscriptionCreationRequirements,
  UserSubscription,
} from "../types/subscription";
import { firestore } from "./firebaseAdmin";
import {
  getCreatorSubscriptionDoc,
  getStripeDoc,
  getStripeInstance,
} from "./stripe";
import Stripe from "stripe";
import { addMonths } from "date-fns";
import { CallableRequest, HttpsError } from "firebase-functions/v2/https";
import { getUser, isUserBlocked } from "./users";

export const getSubscriber = async (creatorId: string, userId: string) => {
  const subscriberRef = firestore
    .collection("learners")
    .doc(`${creatorId}_${userId}`);
  const subscriberDoc = await subscriberRef.get();
  if (!subscriberDoc.exists) return null;
  return subscriberDoc.data() as Subscriber;
};

export const checkUserSubscribeToCreator = async (
  creatorId: string,
  userId: string
) => {
  const subscriber = await getSubscriber(creatorId, userId);

  return {
    isSubscribed:
      subscriber?.status === "active" ||
      subscriber?.status === "trialing" ||
      false,
    isPastDue: subscriber?.status === "past_due" || false,
    subscriber,
  };
};

export const cancelSubscription = async (
  subscriptionId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const cancelledSubscription = await stripe.subscriptions.cancel(
    subscriptionId,
    { stripeAccount: creatorConnectId }
  );
  return cancelledSubscription;
};

export const cancelSubscriptionAtPeriodEnd = async (
  subscriptionId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const cancelledSubscription = await stripe.subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: true },
    { stripeAccount: creatorConnectId }
  );
  return cancelledSubscription;
};

export const addSubscriptionDocuments = async (
  subscription: Stripe.Subscription
) => {
  const { creatorUid, subscriberUid } = subscription.metadata;
  const subscriberRef = firestore
    .collection("learners")
    .doc(`${creatorUid}_${subscriberUid}`);
  const subscriberData = {
    id: `${creatorUid}_${subscriberUid}`,
    subscriberId: subscriberUid,
    creatorId: creatorUid,
    amount: subscription.items.data[0].price.unit_amount,
    status: subscription.status,
    startDate: convertUnixToFirestoreTimestamp(subscription.start_date),
    latestSubscriptionId: subscription.id,
    currentPeriodStart: convertUnixToFirestoreTimestamp(
      subscription.current_period_start
    ),
    currentPeriodEnd: convertUnixToFirestoreTimestamp(
      subscription.current_period_end
    ),
    cancelAt: subscription.cancel_at
      ? convertUnixToFirestoreTimestamp(subscription.cancel_at)
      : null,
    cancelledAt: subscription.canceled_at
      ? convertUnixToFirestoreTimestamp(subscription.canceled_at)
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    deletedAt: null,
  };

  await subscriberRef.set(subscriberData, { merge: true });

  // update the subscriptionIds array separately
  await subscriberRef.update({
    subscriptionIds: FieldValue.arrayUnion(subscription.id),
  });

  const subscriptionData = {
    status: subscription.status,
    id: subscription.id,
    creatorUid,
    subscriberUid,
    amount: subscription.items.data[0].price.unit_amount,
    startDate: convertUnixToFirestoreTimestamp(subscription.start_date),
    currentPeriodEnd: convertUnixToFirestoreTimestamp(
      subscription.current_period_end
    ),
    currentPeriodStart: convertUnixToFirestoreTimestamp(
      subscription.current_period_start
    ),
    cancelAt: subscription.cancel_at
      ? convertUnixToFirestoreTimestamp(subscription.cancel_at)
      : null,
    cancelledAt: subscription.canceled_at
      ? convertUnixToFirestoreTimestamp(subscription.canceled_at)
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancellationReason: null,
  };
  await firestore
    .collection("users_subscriptions")
    .doc(subscription.id)
    .set(subscriptionData);
};

export const getUsersActiveSubscriptions = async (userId: string) => {
  const userSubscriptionRef = firestore
    .collection("users_subscriptions")
    .where("subscriberUid", "==", userId)
    .where("status", "in", ["active", "trialing"]);
  const userSubscriptionSnapshot = await userSubscriptionRef.get();
  const userSubscriptionData = userSubscriptionSnapshot.docs.map((doc) =>
    doc.data()
  );
  return userSubscriptionData as UserSubscription[];
};

export const addFreeTrialToResetBillingPeriod = async (
  subscriptionId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  // During testing utilizing stripe simulation, make sure it leads to future
  // Example: If you advancing 1 month three days, then below add 2 months and three days. (Only for testing)
  const oneMonthFromNow = addMonths(new Date(), 1);
  const oneMonthFromNowUnixTimstamp = Math.floor(
    oneMonthFromNow.getTime() / 1000
  );
  const subscription = await stripe.subscriptions.update(
    subscriptionId,
    { trial_end: oneMonthFromNowUnixTimstamp, proration_behavior: "none" },
    { stripeAccount: creatorConnectId }
  );
  return subscription;
};

export const getCreatorActiveSubscribers = async (creatorId: string) => {
  const subscribersRef = firestore
    .collection("learners")
    .where("creatorId", "==", creatorId)
    .where("status", "in", ["active", "trialing"]);
  const subscribersSnapshot = await subscribersRef.get();
  const subscribersData = subscribersSnapshot.docs.map((doc) => doc.data());
  return subscribersData as Subscriber[];
};

export const validateSubscriptionRequirements = async (
  request: CallableRequest
): Promise<SubscriptionCreationRequirements> => {
  const { uid: userId } = request.auth || {};
  const { creatorUid } = request.data || {};

  // Basic auth checks
  if (!userId) {
    throw new HttpsError("unauthenticated", "User is not authenticated.");
  }
  if (!creatorUid) {
    throw new HttpsError(
      "failed-precondition",
      "You need to provide a creator UID."
    );
  }

  // Get and validate creator stripe account
  const creatorStripeDoc = await getStripeDoc(creatorUid);
  if (!creatorStripeDoc?.stripeConnectId || creatorStripeDoc?.deletedAt) {
    throw new HttpsError(
      "failed-precondition",
      "Educator does not have a Stripe account set."
    );
  }

  // Get and validate user stripe document
  const stripeUserDoc = await firestore
    .collection("stripe_users")
    .doc(userId)
    .get();
  const stripeUserData = stripeUserDoc.data();

  if (!stripeUserDoc.exists || stripeUserData?.deletedAt) {
    throw new HttpsError(
      "failed-precondition",
      "User does not have a doc in stripe_users."
    );
  }
  if (!stripeUserData?.stripeCustomerId) {
    throw new HttpsError(
      "failed-precondition",
      "User does not have a stripe customer."
    );
  }
  if (!stripeUserData?.activePaymentMethodId) {
    throw new HttpsError(
      "failed-precondition",
      "User does not have an active payment method."
    );
  }

  // Get and validate user
  const userDoc = await getUser(userId);
  if (!userDoc) {
    throw new HttpsError("not-found", "User not found.");
  }

  // Get and validate creator subscription details
  const creatorSubscriptionDoc = await getCreatorSubscriptionDoc(creatorUid);
  if (!creatorSubscriptionDoc?.subscriptionPrice) {
    throw new HttpsError(
      "failed-precondition",
      "Educator does not have a subscription price."
    );
  }
  if (!creatorSubscriptionDoc?.productStripeId) {
    throw new HttpsError(
      "failed-precondition",
      "Educator does not have a product set."
    );
  }

  const isBlocked = await isUserBlocked(creatorUid, userId);

  if (isBlocked) {
    throw new HttpsError("failed-precondition", "User is blocked.");
  }

  return {
    userId,
    creatorUid,
    creatorConnectId: creatorStripeDoc.stripeConnectId,
    stripeCustomerId: stripeUserData.stripeCustomerId,
    platformPaymentMethodId: stripeUserData.activePaymentMethodId,
    subscriptionPrice: creatorSubscriptionDoc.subscriptionPrice,
    productId: creatorSubscriptionDoc.productStripeId,
    userDisplayname: userDoc.displayName,
  };
};

export const reActivateSubscription = async (
  subscriptionId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const subscription = await stripe.subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: false },
    { stripeAccount: creatorConnectId }
  );
  return subscription;
};

export const getLatestInvoice = async (
  subscriptionId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const invoice = await stripe.invoices.list(
    { subscription: subscriptionId, limit: 1 },
    { stripeAccount: creatorConnectId }
  );
  if (invoice.data.length === 0) return null;
  return invoice.data[0];
};
