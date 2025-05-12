import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { logWarning } from "../../services/logging";
import { VideoStates } from "../../types/videoStatus";
import { deleteTempReelCleanupTask } from "../../services/cleanupScheduling";
import {
  createScheduledReelTask,
  deleteScheduledReelTask,
  updateScheduledReelTask,
} from "../../services/reelScheduling";
import { ReelData } from "../../types/reels";
import { sendNotification } from "../../services/notifications";
import { getUser } from "../../services/users";
import {
  EmailDynamicDataType,
  EmailType,
  InAppNotificationIconType,
  InAppNotificationType,
} from "../../types/pubsub";
import { getCreatorActiveSubscribers } from "../../services/subscription";
import { sendEmail } from "../../services/sendgrid";
import {
  sendPostRemovedNotification,
  sendPostRestoredNotification,
} from "../../services/moderation";

export const reelUpdated = onDocumentUpdated(
  "reels/{reelId}",
  async (event) => {
    const snapshot = event.data;

    if (!snapshot) {
      logWarning("No data associated with the event", event);
      return;
    }

    const { reelId } = event.params;
    const newData = snapshot.after.data();

    // If the reel isn't in ready state, we don't need to do anything
    if (newData.status !== "ready") {
      return;
    }

    const oldData = snapshot.before.data();
    const hasTypeChanged = oldData.type !== newData.type;

    // None of the promises rely on each other, so we can run them in parallel
    const promises = [];

    // If the type has changed from temp to anything else, we need to delete
    // the cleanup task from the task queue
    if (hasTypeChanged && oldData.type === VideoStates.TEMP) {
      promises.push(deleteTempReelCleanupTask(reelId));
    }

    const reel = newData as ReelData;

    // If the video is scheduled from another state, we need to schedule the
    // "publish reel" task
    if (hasTypeChanged && reel.type === VideoStates.SCHEDULED) {
      promises.push(createScheduledReelTask(reel));
    }

    // If we're changing the type from scheduled to anything else, we need to
    // delete the scheduled "publish reel" task
    if (
      oldData.type === VideoStates.SCHEDULED &&
      reel.type !== VideoStates.SCHEDULED
    ) {
      promises.push(deleteScheduledReelTask(reel));
    }

    // If the type hasn't changed and the reel is still scheduled, we need to
    // to check if the scheduled time has changed
    if (!hasTypeChanged && reel.type === VideoStates.SCHEDULED) {
      const oldScheduledAt = oldData.scheduledAt?.toDate();
      const newScheduledAt = reel.scheduledAt?.toDate();

      const hasChanged =
        oldScheduledAt?.getTime() !== newScheduledAt?.getTime();

      if (hasChanged) {
        promises.push(updateScheduledReelTask(reel));
      }
    }

    // Run all the promises in parallel
    await Promise.all(promises);

    // If the type has changed to active, we need to send
    // notifications to learners
    if (hasTypeChanged && newData.type === VideoStates.ACTIVE) {
      const creator = await getUser(reel.creatorId);
      const learners = await getCreatorActiveSubscribers(reel.creatorId);

      if (learners.length > 0) {
        const notificationData = {
          title: creator?.displayName || creator?.username || "Educator",
          type: InAppNotificationType.USER_NEW_POST,
          iconType: InAppNotificationIconType.STORAGE,
          message: "Posted a new reel.",
          iconStorageUrl: creator?.avatar_url,
          metadata: { creatorId: reel.creatorId, reelId },
        };

        // Create notification and email promises for each subscriber
        const notificationPromises = learners.map((subscriber) =>
          sendNotification({
            to: subscriber.subscriberId,
            data: notificationData,
          })
        );

        const emailPromises = learners.map(async (subscriber) => {
          const emailData: EmailDynamicDataType = {
            type: EmailType.NEW_POST,
            creatorName:
              creator?.displayName || creator?.username || "Educator",
            reelThumbnailUrl: reel?.thumbnail || "",
            reelUrl: `${process.env.APPLICATION_DOMAIN}/${creator?.username}/${reelId}`,
          };

          return sendEmail({
            userId: subscriber.subscriberId,
            data: {
              ...emailData,
            },
          });
        });

        // Add bulk notification and email sending to our promises array
        promises.push(Promise.all(notificationPromises));
        promises.push(Promise.all(emailPromises));
      }
    }

    // If the reel is blocked, send a notification to the creator
    const isNewlyBlocked =
      oldData.isBlocked === false && newData.isBlocked === true;
    if (isNewlyBlocked) {
      await sendPostRemovedNotification(reelId, reel.creatorId);
    }

    // If the reel is unblocked, send a notification to the creator
    const isNewlyUnblocked =
      oldData.isBlocked === true && newData.isBlocked === false;
    if (isNewlyUnblocked) {
      await sendPostRestoredNotification(reelId, reel.creatorId);
    }
  }
);
