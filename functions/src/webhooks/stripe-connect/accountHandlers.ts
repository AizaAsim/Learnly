import Stripe from "stripe";
import { logInfo } from "../../services/logging";
import { firestore } from "../../services/firebaseAdmin";
import { sendEmail } from "../../services/sendgrid";
import { EmailDynamicDataType, EmailType } from "../../types/pubsub";
import { createAccountLink } from "../../services/stripe";

export async function handleAccountUpdated(event: Stripe.AccountUpdatedEvent) {
  logInfo(event);
  const account = event.data.object;
  const uid = account.metadata?.firestoreUid;
  if (!uid) {
    throw new Error("No UID found in account metadata");
  }

  const docRef = firestore.collection("stripe").doc(uid);
  const docSnapshot = await docRef.get();
  if (!docSnapshot.exists) {
    throw new Error("Document does not exist");
  }

  const docData = docSnapshot.data();
  await docRef.update({
    requirements: account.requirements,
    payouts_enabled: account.payouts_enabled,
    charges_enabled: account.charges_enabled,
  });

  const pastDue = account.requirements?.past_due || [];

  // SEND PROFILE NOT PUBLICALLY VISIBLE EMAIL
  if (pastDue.length > 0 && docData && docData.hasShownActivationModal) {
    try {
      const stripeConnectId = docData?.stripeConnectId;

      const accountSession = await createAccountLink(
        stripeConnectId,
        "account_onboarding"
      );

      const emailData: EmailDynamicDataType = {
        type: EmailType.PROFILE_NOT_VISIBLE,
        stripeAccountUrl: accountSession.url,
      };

      await sendEmail({
        userId: uid,
        data: emailData,
      });
    } catch (error) {
      logInfo("Failed to send email:", error);
    }
  }
}
