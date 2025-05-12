import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { firestore, storage } from "../../services/firebaseAdmin";
import { logError, logInfo } from "../../services/logging";
import { AppError } from "../../shared/classes/AppError";

interface RequestBody {
  userId: string;
}

export const deleteUser = onRequest(
  {
    ...corsOptions,
    timeoutSeconds: 900,
    ingressSettings: "ALLOW_INTERNAL_ONLY",
  },
  async (request, response) => {
    const { userId } = request.body as RequestBody;
    if (!userId) {
      response.status(400).send("Invalid request body");
      return;
    }
    logInfo(`Deleting user ${userId}`);
    try {
      const userRef = firestore.doc(`users/${userId}`);
      const stripeUserRef = firestore.doc(`stripe_users/${userId}`);

      await Promise.all([
        firestore.recursiveDelete(userRef),
        firestore.recursiveDelete(stripeUserRef),
      ]);

      logInfo(`User documents for ${userId} deleted from Firestore`);

      // TODO: Decide if we want to delete the user subscriptions related collection (learners, users_subscriptions, invoices)

      const bucket = storage.bucket();
      await bucket.deleteFiles({
        prefix: `users/${userId}`,
      });
      response.status(200).send(`User ${userId} deleted`);
    } catch (error) {
      logError("Error deleting user:", error);
      if (error instanceof AppError)
        response.status(error.statusCode).send(error.message);
      else response.status(500).send("Failed to delete user");
    }
  }
);
