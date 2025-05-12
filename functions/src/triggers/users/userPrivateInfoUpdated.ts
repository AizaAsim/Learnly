import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { logError, logWarning } from "../../services/logging";
import { getUser } from "../../services/users";
import { sendNotification } from "../../services/notifications";
import {
  InAppNotificationIconType,
  InAppNotificationType,
} from "../../types/pubsub";

export const userPrivateInfoUpdated = onDocumentUpdated(
  "users/{docId}/private/info",
  async (event) => {
    const snapshot = event.data;
    const userId = event.params.docId;
    if (!snapshot) {
      logWarning("No data associated with the event", event);
      return;
    }
    const data = snapshot.after.data();
    if (!data) {
      logWarning("No data associated with the snapshot", event, snapshot);
      return;
    }
    const user = await getUser(userId);
    const role = user?.role;

    // Check if email is updated
    const before = snapshot.before.data();
    const after = snapshot.after.data();
    if (before.email !== after.email) {
      try {
        // Send in app notification that email is updated
        const notificationData = {
          title: "Email Updated",
          type:
            role === "user"
              ? InAppNotificationType.USER_EMAIL_UPDATE
              : InAppNotificationType.CREATOR_EMAIL_UPDATE,
          iconType: InAppNotificationIconType.STATIC,
          message: "Email changed successfully.",
        };
        await sendNotification({
          to: after.email,
          data: notificationData,
        });
      } catch (err) {
        logError("Error updating stripe account email", err);
      }
    }
  }
);
