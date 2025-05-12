import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logError, logWarning } from "../../services/logging";
import { Interaction } from "../../types";
import { firestore } from "../../services/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const likeCreated = onDocumentCreated(
  "likes/{likeId}",
  async (event) => {
    const snapshot = event.data;
    const { likeId } = event.params;
    if (!snapshot) {
      logWarning("No data associated with the event", event);
      return;
    }
    const likeData = snapshot.data() as Interaction;
    if (!likeData) {
      logWarning("No data associated with the snapshot", event, snapshot);
      return;
    }

    try {
      // increment like counter both inside user (creator) and reel
      const docRef = firestore.doc(likeData.target);
      await docRef.update({
        likesCount: FieldValue.increment(1),
      });
      const creatorRef = firestore.collection("users").doc(likeData.creatorId);
      await creatorRef.update({
        likesCount: FieldValue.increment(1),
      });
    } catch (error) {
      const message = `Error incrementing like counts for ${likeId}`;
      logError(message, event, error);
    }
  }
);
