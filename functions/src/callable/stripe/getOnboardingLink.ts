import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { createAccountLink, getStripeDoc } from "../../services/stripe";

export const getOnboardingLink = onCall(corsOptions, async (request) => {
  try {
    const userId = request.auth?.uid;
    if (!userId)
      throw new HttpsError("unauthenticated", "User is not authenticated.");

    const isEmailVerified = request.auth?.token.email_verified;
    if (!isEmailVerified)
      throw new HttpsError("failed-precondition", "Email is not verified.");

    const stripeDoc = await getStripeDoc(userId);
    const stripeConnectId = stripeDoc?.stripeConnectId;
    if (!stripeConnectId) {
      throw new HttpsError(
        "failed-precondition",
        "You need to create a Stripe Connect account first."
      );
    }
    const accountSession = await createAccountLink(
      stripeConnectId,
      "account_onboarding"
    );
    const resp = {
      url: accountSession.url,
    };
    return resp;
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to fetch account session");
  }
});
