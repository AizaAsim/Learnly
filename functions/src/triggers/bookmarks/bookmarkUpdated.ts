import { FieldValue } from "firebase-admin/firestore";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { firestore } from "../../services/firebaseAdmin";
import { logError, logWarning } from "../../services/logging";
import { Interaction } from "../../types";

export const bookmarkUpdated = onDocumentUpdated(
  "bookmarks/{bookmarkId}",
  async (event) => {
    const snapshot = event.data;
    const { bookmarkId } = event.params;
    if (!snapshot) {
      logWarning("No data associated with the event", event);
      return;
    }
    const bookmarkDataBefore = snapshot.before.data() as Interaction;
    const bookmarkDataAfter = snapshot.after.data() as Interaction;
    if (!bookmarkDataAfter || !bookmarkDataBefore) {
      logWarning("No data associated with the snapshot", event, snapshot);
      return;
    }

    try {
      if (bookmarkDataAfter.deleted === bookmarkDataBefore.deleted) {
        return;
      }
      const docRef = firestore.doc(bookmarkDataAfter.target);
      await docRef.update({
        bookmarksCount: FieldValue.increment(
          bookmarkDataAfter.deleted ? -1 : 1
        ),
      });
      const creatorRef = firestore
        .collection("users")
        .doc(bookmarkDataAfter.creatorId);
      await creatorRef.update({
        bookmarksCount: FieldValue.increment(
          bookmarkDataAfter.deleted ? -1 : 1
        ),
      });
    } catch (error) {
      const message = `Error updating bookmark counts for ${bookmarkId}`;
      logError(message, event, error);
    }
  }
);
