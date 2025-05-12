import { FieldValue } from "firebase-admin/firestore";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { firestore } from "../../services/firebaseAdmin";
import { logError, logWarning } from "../../services/logging";
import { Interaction } from "../../types";

export const likeUpdated = onDocumentUpdated(
  "likes/{likeId}",
  async (event) => {
    const snapshot = event.data;
    const { likeId } = event.params;
    if (!snapshot) {
      logWarning("No data associated with the event", event);
      return;
    }
    const likeDataBefore = snapshot.before.data() as Interaction;
    const likeDataAfter = snapshot.after.data() as Interaction;
    if (!likeDataBefore || !likeDataAfter) {
      logWarning("No data associated with the snapshot", event, snapshot);
      return;
    }

    try {
      if (likeDataBefore.deleted === likeDataAfter.deleted) {
        return;
      }
      const docRef = firestore.doc(likeDataAfter.target);
      await docRef.update({
        likesCount: FieldValue.increment(likeDataAfter.deleted ? -1 : 1),
      });
      const creatorRef = firestore
        .collection("users")
        .doc(likeDataAfter.creatorId);
      await creatorRef.update({
        likesCount: FieldValue.increment(likeDataAfter.deleted ? -1 : 1),
      });
    } catch (error) {
      const message = `Error updating like counts for ${likeId}`;
      logError(message, event, error);
    }
  }
);
