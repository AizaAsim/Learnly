import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logError, logWarning } from "../../services/logging";
import { createTempReelCleanupTask } from "../../services/cleanupScheduling";

export const reelCreated = onDocumentCreated(
  "reels/{reelId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logWarning("No data associated with the event", event);
      return;
    }

    try {
      // If the user leaves the reel hanging during upload we need to remove it
      const { reelId } = event.params;
      await createTempReelCleanupTask(reelId);
    } catch (error) {
      logError("Error scheduling temp reel cleanup", error);
    }
  }
);
