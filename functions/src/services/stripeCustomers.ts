import Stripe from "stripe";
import { getStripeInstance } from "./stripe";
import { firestore } from "./firebaseAdmin";
import { ConnectedPaymentMethod, PaymentMethod } from "../types/subscription";
import { convertUnixToFirestoreTimestamp } from "../shared/helpers/utils";

/**
 * Creates a Stripe Customer account.
 * @param uid User ID
 * @param email User email
 * @param {Stripe.CustomerCreateParams} [customerCreationOptions = {}] Optional parameters for Stripe customer creation
 * @returns {Promise<Stripe.Response<Stripe.Customer>>} Created Stripe Customer Object
 */
export const createStripeCustomerAccount = async (
  uid: string,
  customerCreationOptions: Stripe.CustomerCreateParams = {},
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  // More info can be passed like name or phone using customerCreationOptions depending upon what we are collecting during sign up
  const customerData: Stripe.CustomerCreateParams = {
    ...customerCreationOptions,
    metadata: {
      firestoreUid: uid,
    },
  };
  const customer = await stripe.customers.create(customerData, {
    stripeAccount: creatorConnectId,
  });
  return customer;
};

/**
 * Retrieves a customer account from stripe by its ID.
 * @param customerId Stripe customer ID
 * @returns {Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>} Retrieved Customer account
 */
export const getStripeCustomer = async (customerId: string) => {
  const stripe = getStripeInstance();
  const customer = await stripe.customers.retrieve(customerId);
  return customer;
};

/**
 * Change the default payment method for a customer for future invoices.
 * @param customerId Stripe Customer ID
 * @param paymentMethod id of the payment method to set as default
 * @param creatorConnectId Connect ID of the creator
 * @returns {Promise<Stripe.Response<Stripe.Customer>>} Updated Customer Object
 */
export const changeCustomerDefaultPaymentMethod = async (
  customerId: string,
  paymentMethodId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const customer = await stripe.customers.update(
    customerId,
    {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    },
    { stripeAccount: creatorConnectId }
  );
  return customer;
};

export const getCustomerDoc = async (creatorId: string, userId: string) => {
  const customerDocSnapshot = await firestore
    .collection("stripe_users")
    .doc(userId)
    .collection("stripe_customers")
    .doc(creatorId)
    .get();
  if (!customerDocSnapshot.exists) {
    return null;
  }
  const customerDoc = customerDocSnapshot.data();
  return customerDoc;
};

/**
 * Update a customer's object in stripe.
 * @param customerId Stripe Customer ID
 * @param updateData Data to update
 * @param creatorConnectId Connect ID of the creator
 * @returns {Promise<Stripe.Response<Stripe.Customer>>} Updated Customer Object
 */
export const updateStripeCustomer = async (
  customerId: string,
  updateData: Stripe.CustomerUpdateParams,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const customer = await stripe.customers.update(customerId, updateData, {
    stripeAccount: creatorConnectId,
  });
  return customer;
};

export const clonePaymentMethodToConnectedAccount = async (
  paymentMethodId: string,
  customerId: string,
  creatorConnectId: string,
  userId: string
) => {
  const stripe = getStripeInstance();
  const paymentMethod = await stripe.paymentMethods.create(
    {
      payment_method: paymentMethodId,
      customer: customerId,
      metadata: { firestoreUid: userId },
    },
    { stripeAccount: creatorConnectId }
  );
  return paymentMethod;
};

export const attachPaymentMethodToCustomer = async (
  paymentMethodId: string,
  customerId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const paymentMethod = await stripe.paymentMethods.attach(
    paymentMethodId,
    {
      customer: customerId,
    },
    { stripeAccount: creatorConnectId }
  );
  return paymentMethod;
};

export const deattachPaymentMethodFromCustomer = async (
  paymentMethodId: string,
  creatorConnectId?: string
) => {
  const stripe = getStripeInstance();
  const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId, {
    stripeAccount: creatorConnectId,
  });
  return paymentMethod;
};

/**
 * Sets up a new payment method for a customer in a connected Stripe account.
 *
 * This function performs the following actions:
 * 1. Clones the payment method from the platform account to the connected account.
 * 2. Attaches the cloned payment method to the customer in the connected account.
 * 3. Sets the cloned payment method as the default payment method for the customer.
 * 4. Saves the connected payment method in the database.
 * 5. Updates the stripe_customers document with the platform payment method ID.
 *
 * @param {string} platformPaymentMethodId - The ID of the payment method in the platform account.
 * @param {string} stripeCustomerId - The ID of the Stripe customer in the platform account.
 * @param {string} creatorConnectId - The ID of the connected Stripe account.
 * @param {string} userId - The ID of the user associated with the payment method.
 * @param {string} customerId - The ID of the customer in the connected account.
 * @param {string} creatorId - The ID of the creator.
 *
 * @returns {Promise<Stripe.Response<Stripe.PaymentMethod>>} - The newly cloned and attached payment method object.
 */
export const setupCustomerPaymentMethodInConnectedAccount = async (
  platformPaymentMethodId: string,
  stripeCustomerId: string,
  creatorConnectId: string,
  userId: string,
  customerId: string,
  creatorId: string
) => {
  // Clone the payment method to the connected account
  const paymentMethod = await clonePaymentMethodToConnectedAccount(
    platformPaymentMethodId,
    stripeCustomerId,
    creatorConnectId,
    userId
  );

  // Attach the cloned payment method to the customer in the connected account
  await attachPaymentMethodToCustomer(
    paymentMethod.id,
    customerId,
    creatorConnectId
  );

  // Set the cloned payment method as default for the customer in the connected account
  await changeCustomerDefaultPaymentMethod(
    customerId,
    paymentMethod.id,
    creatorConnectId
  );
  // Save the connected payment method in the database
  const stripeUserDocRef = firestore.collection("stripe_users").doc(userId);
  await stripeUserDocRef
    .collection("connected_payment_methods")
    .doc(paymentMethod.id)
    .set({
      connectPaymentMethod: paymentMethod.id,
      creatorConnectId,
      connectCustomerId: customerId,
      platformPaymentMethodId,
    });

  // Update the stripe_customers document with the payment method ID
  const stripeCustomerDocRef = stripeUserDocRef
    .collection("stripe_customers")
    .doc(creatorId);
  await stripeCustomerDocRef.update({
    paymentMethodId: platformPaymentMethodId,
  });

  return paymentMethod;
};

export const checkIfPaymentMethodBelongsToUser = async (
  userId: string,
  paymentMethodId: string
) => {
  const paymentMethodDocRef = await firestore
    .collection("stripe_users")
    .doc(userId)
    .collection("payment_methods")
    .doc(paymentMethodId)
    .get();
  const isBelongToUser = paymentMethodDocRef.exists;
  const data = (paymentMethodDocRef.data() as PaymentMethod) || null;
  return {
    isBelongToUser,
    paymentMethod: isBelongToUser ? data : null,
  };
};

export const checkExistingConnectedPaymentMethod = async (
  userId: string,
  creatorConnectId: string,
  platformPaymentMethodId: string
) => {
  const stripeUserDocRef = firestore.collection("stripe_users").doc(userId);
  const connectedPaymentMethodsRef = stripeUserDocRef
    .collection("connected_payment_methods")
    .where("creatorConnectId", "==", creatorConnectId)
    .where("platformPaymentMethodId", "==", platformPaymentMethodId);

  const existingPaymentMethods = await connectedPaymentMethodsRef.get();

  if (!existingPaymentMethods.empty) {
    return existingPaymentMethods.docs[0].data() as ConnectedPaymentMethod;
  }

  return null;
};

export const savePlatformPaymentMethod = async (
  userId: string,
  paymentMethod: Stripe.PaymentMethod,
  paymentMethodId: string
) => {
  const stripeUserDocRef = firestore.collection("stripe_users").doc(userId);

  // Save in payment_methods collection
  const paymentMethodData: PaymentMethod = {
    id: paymentMethodId,
    type: paymentMethod.type,
    brand: paymentMethod.card?.brand || null,
    expMonth: paymentMethod.card?.exp_month || null,
    expYear: paymentMethod.card?.exp_year || null,
    last4: paymentMethod.card?.last4 || null,
    cardholderName: paymentMethod.billing_details?.name || null,
    isActive: true,
    createdAt: convertUnixToFirestoreTimestamp(paymentMethod.created),
  };

  const paymentMethodsRef = stripeUserDocRef.collection("payment_methods");
  await paymentMethodsRef.doc(paymentMethodId).set(paymentMethodData);
};
