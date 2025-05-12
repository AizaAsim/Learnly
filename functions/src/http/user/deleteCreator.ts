import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { firestore, storage } from "../../services/firebaseAdmin";
import { logError, logInfo } from "../../services/logging";
import { AppError } from "../../shared/classes/AppError";
import { deleteAllReelsForCreator } from "../../services/videos";

interface DeleteCreatorRequest {
  userId: string;
}

export const deleteCreator = onRequest(
  {
    ...corsOptions,
    timeoutSeconds: 1800,
    ingressSettings: "ALLOW_INTERNAL_ONLY",
  },
  async (request, response) => {
    const { userId } = request.body as DeleteCreatorRequest;

    if (!userId) {
      response.status(400).send("Invalid request body: userId is required");
      return;
    }

    logInfo(`Initiating deletion process for creator ${userId}`);

    try {
      // Delete all reels associated with the creator
      await deleteAllReelsForCreator(userId);

      const batch = firestore.batch();

      // Delete Stripe document
      batch.delete(firestore.doc(`stripe/${userId}`));

      // Delete creator subscriptions
      const subscriptionsSnapshot = await firestore
        .collection("creators_subscriptions")
        .where("creatorUid", "==", userId)
        .get();

      subscriptionsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Delete user document recursively
      const userRef = firestore.doc(`users/${userId}`);
      await firestore.recursiveDelete(userRef);

      // Delete files from storage
      await storage.bucket().deleteFiles({ prefix: `creators/${userId}` });

      response
        .status(200)
        .send(`Educator ${userId} and associated data deleted successfully`);
    } catch (error) {
      logError("Error occurred during deletion process:", error);

      if (error instanceof AppError) {
        response.status(error.statusCode).send(error.message);
      } else {
        response.status(500).send("Failed to delete creator");
      }
    }
  }
);
