import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logError, logWarning } from "../../services/logging";
import { Interaction } from "../../types";
import { firestore } from "../../services/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const bookmarkCreated = onDocumentCreated(
  "bookmarks/{bookmarkId}",
  async (event) => {
    const snapshot = event.data;
    const { bookmarkId } = event.params;
    if (!snapshot) {
      logWarning("No data associated with the event", event);
      return;
    }
    const bookmarkData = snapshot.data() as Interaction;
    if (!bookmarkData) {
      logWarning("No data associated with the snapshot", event, snapshot);
      return;
    }

    try {
      // increment bookmark count both inside user (creator) and reel
      const docRef = firestore.doc(bookmarkData.target);
      await docRef.update({
        bookmarksCount: FieldValue.increment(1),
      });
      const creatorRef = firestore
        .collection("users")
        .doc(bookmarkData.creatorId);
      await creatorRef.update({
        bookmarksCount: FieldValue.increment(1),
      });
    } catch (error) {
      const message = `Error incrementing bookmarks counts for ${bookmarkId}`;
      logError(message, event, error);
    }
  }
);
