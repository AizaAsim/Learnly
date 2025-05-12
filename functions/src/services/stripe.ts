import { HttpsError, Request } from "firebase-functions/v2/https";
import Stripe from "stripe";
import { logError } from "./logging";
import { firestore } from "./firebaseAdmin";
import { StripeAccountDoc } from "../types/stripeAccount";

export const getStripeInstance = () => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    logError("Stripe secret key is not set.");
    throw new HttpsError("internal", "Something went wrong.");
  }
  const stripe = new Stripe(stripeSecret);
  return stripe;
};

const getCreatorSharePercentage = () => {
  const creatorSharePercentage = process.env.CREATOR_SHARE_PERCENTAGE;
  if (!creatorSharePercentage) {
    logError("Educator share percentage is not set.");
    throw new HttpsError("internal", "Something went wrong.");
  }
  return Number(creatorSharePercentage);
};

const getStripeWebhookSecret = (isConnectWebhook: boolean): string => {
  const webhookSecret = isConnectWebhook
    ? process.env.STRIPE_CONNECT_WEBHOOK_SECRET
    : process.env.STRIPE_PLATFORM_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logError("Stripe webhook secret is not set.");
    throw new HttpsError("internal", "Something went wrong.");
  }

  return webhookSecret;
};

export const createCreatorProduct = async (
  creatorUid: string,
  creatorName: string,
  creatorConnectId: string
) => {
  const stripe = getStripeInstance();
  const product = await stripe.products.create(
    {
      id: `creator_product_${creatorUid}`,
      name: `Subscription to ${creatorName}`,
    },
    {
      stripeAccount: creatorConnectId,
    }
  );
  return product;
};

/**
 * Verifies the source of the webhook request and constructs the event object.
 * @param request Request object
 * @param isConnectWebhook Whether the webhook is for a Connect account
 * @returns {Stripe.Event} Constructed Stripe Event Object
 */
export const verifyAndConstructWebhookEvent = (
  request: Request,
  isConnectWebhook: boolean
): Stripe.Event => {
  const stripe = getStripeInstance();
  const webhookSecret = getStripeWebhookSecret(isConnectWebhook);
  const signature = request.headers["stripe-signature"] as string;
  const event = stripe.webhooks.constructEvent(
    request.rawBody,
    signature,
    webhookSecret
  );
  return event;
};

/**
 * Creates a session for the stripe connect account
 * @param connectAccountId Connect Account Id
 * @returns {Promise<Stripe.Response<Stripe.AccountSession>>} AccountSession Object
 */
export const createAccountSession = async (connectAccountId: string) => {
  const stripe = getStripeInstance();
  const accountSession = await stripe.accountSessions.create({
    account: connectAccountId,
    components: {
      account_onboarding: {
        enabled: true,
        features: {
          external_account_collection: true,
        },
      },
    },
  });
  return accountSession;
};

/**
 * Creates an account link for the Stripe Connect account.
 * @param {string} connectAccountId - The ID of the Stripe Connect account.
 * @param {Stripe.AccountLinkCreateParams.Type} linkType - The type of the account link.
 * @returns {Promise<Stripe.Response<Stripe.AccountLink>>} - A promise that resolves to the AccountLink object.
 */
export const createAccountLink = async (
  connectAccountId: string,
  linkType: Stripe.AccountLinkCreateParams.Type
) => {
  const stripe = getStripeInstance();
  const accountLink = await stripe.accountLinks.create({
    account: connectAccountId,
    // TODO: check these URLs
    return_url: process.env.APPLICATION_DOMAIN,
    refresh_url: process.env.APPLICATION_DOMAIN,
    type: linkType,
  });
  return accountLink;
};

/**
 * Creates a Stripe Standard Connected account.
 * @param uid User ID
 * @param email User email
 * @param name User name
 * @param {Stripe.AccountCreateParams} [accountCreationOptions = {}] Optional parameters for Stripe account creation
 * @returns {Promise<Stripe.Response<Stripe.Account>>} Created Stripe Account Object
 */
export const createStripeConnectAccount = async (
  uid: string,
  email: string,
  name: string,
  accountCreationOptions: Stripe.AccountCreateParams = {}
) => {
  const stripe = getStripeInstance();
  // More info can be prefilled depending upon what we are collecting during sign up
  const accData: Stripe.AccountCreateParams = {
    ...accountCreationOptions,
    email,
    type: "standard",
    business_profile: {
      name,
      url: process.env.APPLICATION_DOMAIN + "/" + name,
      mcc: "5815", // Digital Goods: Media, Books, Movies, Music
      product_description: "Digital content creator",
    },
    settings: {
      payouts: {
        schedule: {
          interval: "manual",
        },
      },
      payments: {
        // The statement descriptor must be at most 22 characters
        statement_descriptor: `Learnly - ${name}`.slice(0, 22),
      },
      card_payments: {
        statement_descriptor_prefix: "Learnly",
      },
    },
    metadata: {
      firestoreUid: uid,
    },
  };
  const account = await stripe.accounts.create(accData);
  return account;
};

/**
 * Retrieves a connect account from stripe by its ID .
 * @param accountId Stripe Connect Account ID
 * @returns {Promise<Stripe.Response<Stripe.Account>>} Retrieved Stripe account
 */
export const getStripeConnectAccount = async (accountId: string) => {
  const stripe = getStripeInstance();
  const account = await stripe.accounts.retrieve(accountId);
  return account;
};

export const getStripeDoc = async (userId: string) => {
  const stripeDocSnapshot = await firestore
    .collection("stripe")
    .doc(userId)
    .get();
  if (!stripeDocSnapshot.exists) {
    return null;
  }
  const stripeDoc = stripeDocSnapshot.data() as StripeAccountDoc;
  return stripeDoc;
};

/**
 * Retrieves a payment method by its ID.
 * @param paymentMethodId Stripe Payment Method ID
 * @returns {Promise<Stripe.Response<Stripe.PaymentMethod>>} Retrieved Payment Method
 */
export const getPaymentMethod = async (paymentMethodId: string) => {
  const stripe = getStripeInstance();
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  return paymentMethod;
};

/**
 * Detaches a payment method from a customer.
 * @param paymentMethodId Stripe Payment Method ID
 * @returns {Promise<Stripe.Response<Stripe.PaymentMethod>>} Deleted Payment Method Object
 * @see https://docs.stripe.com/api/payment_methods/detach
 */
export const detachPaymentMethod = async (
  paymentMethodId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId, {
    stripeAccount: creatorConnectId,
  });
  return paymentMethod;
};

export const createSubscription = async (
  customerId: string,
  amount: number,
  productId: string,
  creatorUid: string,
  creatorConnectId: string,
  subscriberUid: string,
  paymentMethodId?: string
) => {
  const stripe = getStripeInstance();
  const subscriptionData: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          recurring: {
            interval: "month",
          },
          product: productId,
        },
      },
    ],
    application_fee_percent: 100 - getCreatorSharePercentage(),
    metadata: {
      creatorUid,
      subscriberUid,
    },
    expand: ["latest_invoice.payment_intent"],
  };

  if (paymentMethodId)
    subscriptionData.default_payment_method = paymentMethodId;

  const subscription = await stripe.subscriptions.create(subscriptionData, {
    stripeAccount: creatorConnectId,
  });

  return subscription;
};

export const getCreatorSubscriptionDoc = async (creatorUid: string) => {
  const creatorSubDocSnapshot = await firestore
    .collection("creators_subscriptions")
    .where("creatorUid", "==", creatorUid)
    .get();
  if (creatorSubDocSnapshot.empty) {
    return null;
  }
  const creatorSubDoc = creatorSubDocSnapshot.docs[0].data();
  return creatorSubDoc;
};

export const createSetupIntent = async (
  customerId: string,
  userId: string,
  setupIntentCreationOptions?: Stripe.SetupIntentCreateParams
) => {
  const stripe = getStripeInstance();
  const setupIntent = await stripe.setupIntents.create({
    ...setupIntentCreationOptions,
    customer: customerId,
    payment_method_types: ["card"],
    metadata: { firestoreUid: userId },
  });
  return setupIntent;
};

/**
 * Retrieves a payment intent by its ID.
 * @param paymentIntentId Stripe Payment Intent ID
 * @param creatorConnectId Connect ID of the creator
 * @param fieldsToExpand Fields to expand in the response
 * @returns {Promise<Stripe.Response<Stripe.PaymentIntent>>} Retrieved Payment Intent
 */
export const getPaymentIntent = async (
  paymentIntentId: string,
  creatorConnectId?: string,
  fieldsToExpand?: ("payment_method" | "customer")[]
) => {
  const stripe = getStripeInstance();
  const paymentIntent = await stripe.paymentIntents.retrieve(
    paymentIntentId,
    { expand: fieldsToExpand },
    { stripeAccount: creatorConnectId }
  );
  return paymentIntent;
};

export const payInvoice = async (
  invoiceId: string,
  paymentMethodId?: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const invoice = await stripe.invoices.pay(
    invoiceId,
    {
      payment_method: paymentMethodId,
    },
    { stripeAccount: creatorConnectId }
  );

  return invoice;
};

export const getTotaltAvailableBalance = async (creatorConnectId: string) => {
  const stripe = getStripeInstance();
  const balance = await stripe.balance.retrieve({
    stripeAccount: creatorConnectId,
  });
  const usdBalance = balance.available.find(
    (balance) => balance.currency === "usd"
  );
  return usdBalance?.amount ?? 0;
};
