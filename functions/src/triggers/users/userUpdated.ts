import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { logError, logWarning } from "../../services/logging";
import { upsertIndexWithDocuments } from "../../services/meilisearch";
import { firestore } from "../../services/firebaseAdmin";
import {
  createCreatorProduct,
  createStripeConnectAccount,
} from "../../services/stripe";
import { getUser } from "../../services/users";
import { Roles } from "../../types/roles";
import {
  createStripeCustomerAccount,
  updateStripeCustomer,
} from "../../services/stripeCustomers";

export const userUpdated = onDocumentUpdated("users/{docId}", async (event) => {
  const snapshot = event.data;
  const userId = event.params.docId;
  if (!snapshot) {
    logWarning("No data associated with the event", event);
    return;
  }

  const data = snapshot.after.data();
  const previousData = snapshot.before.data();

  if (!data && !previousData) {
    logWarning("No data associated with the snapshot", event, snapshot);
    return;
  }

  // At this point, we have the data and previous data
  const {
    username: previousUsername,
    displayName: previousDisplayName,
    avatar_url: previousAvatarUrl,
  } = previousData;

  const { username, displayName, role, avatar_url } = data;

  // Check if any relevant fields have changed
  const hasRelevantDataChanged = [
    previousUsername !== username,
    previousDisplayName !== displayName,
    previousAvatarUrl !== avatar_url,
  ].some(Boolean);

  // Bail if nothing relevant has changed
  if (!hasRelevantDataChanged) return;

  // Update the relevant meilisearch index
  try {
    const updatedData = {
      id: userId,
      displayName,
      avatar_url,
      ...(role === "creator" && { username }),
    };
    await upsertIndexWithDocuments(role === "creator" ? "creators" : "users", [
      updatedData,
    ]);
  } catch (err) {
    logError("Error adding user in Meilisearch", err);
  }

  // We do not allow creator to move to any page before they have entered username
  // If the creator does not have username before and now they have, this is the first time they have entered username
  // This is the correct time to create their stripe connected account
  try {
    const hasUsernameEnteredFirstTime = !previousData?.username && username;
    if (role === Roles.CREATOR && hasUsernameEnteredFirstTime) {
      const creator = await getUser(userId);
      if (!creator?.email) {
        throw new Error("Educator email not exist");
      }
      await handleCreatorStripeSetup(userId, username, creator.email);
    }
  } catch (error) {
    logError("Error creating stripe connect account", error);
  }

  // We do not allow user to move to any page before they have entered displayName
  // If the creator does not have displayName before and now they have, this is the first time they have entered displayName
  // This is the correct time to create their stripe customer account
  try {
    const hasDisplayNameEnteredFirstTime =
      !previousData?.displayName && displayName;
    if (role === Roles.USER && hasDisplayNameEnteredFirstTime) {
      await handleUserStripeSetup(userId, displayName);
    } else if (role === Roles.USER && !hasDisplayNameEnteredFirstTime) {
      const stripeUserDocRef = firestore.collection("stripe_users").doc(userId);
      const stripeUserDocSnapshot = await stripeUserDocRef.get();
      if (!stripeUserDocSnapshot.exists) {
        throw new Error("User does not have a document in stripe_users.");
      }
      const stripeUserDoc = stripeUserDocSnapshot.data();
      const stripeCustomerId = stripeUserDoc?.stripeCustomerId;
      await updateStripeCustomer(stripeCustomerId, {
        name: displayName,
      });
    }
  } catch (error) {
    logError("Error creating stripe customer account", error);
  }
});

const handleCreatorStripeSetup = async (
  id: string,
  name: string,
  email: string
) => {
  try {
    const account = await createStripeConnectAccount(id, email, name);
    const connectId = account.id;
    await firestore.collection("stripe").doc(id).set({
      stripeConnectId: connectId,
      requirements: account.requirements,
      payouts_enabled: account.payouts_enabled,
      charges_enabled: account.charges_enabled,
      isOnboardingStarted: false,
      hasShownActivationModal: false,
      deletedAt: null,
    });
    const product = await createCreatorProduct(id, name, connectId);
    await firestore.collection("creators_subscriptions").add({
      creatorUid: id,
      productStripeId: product.id,
      deletedAt: null,
    });
  } catch (error) {
    logError(error);
    throw new Error("Error creating stripe connect account");
  }
};

const handleUserStripeSetup = async (id: string, name: string) => {
  try {
    const customer = await createStripeCustomerAccount(id, { name });
    await firestore.collection("stripe_users").doc(id).set(
      {
        stripeCustomerId: customer.id,
        deletedAt: null,
        activePaymentMethodId: null,
      },
      { merge: true }
    );
  } catch (error) {
    logError(error);
    throw new Error("Error creating stripe customer account");
  }
};
