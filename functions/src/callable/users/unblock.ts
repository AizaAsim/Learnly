// Block user functionality is implemented but decided to bnot include in the app
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logCreatorEvent } from "../../services/creatorLogging";
import { logError } from "../../services/logging";
import { getUser, isUserBlocked, unblockUser } from "../../services/users";
import { CreatorLogType } from "../../types/creatorLogging";
import { sendNotification } from "../../services/notifications";
import {
  InAppNotificationIconType,
  InAppNotificationType,
} from "../../types/pubsub";

export const unblock = onCall(corsOptions, async (request) => {
  try {
    const creatorId = request.auth?.uid;
    if (!creatorId)
      throw new HttpsError("unauthenticated", "User is not authenticated");

    const { userId } = request.data;

    const isAlreadyBlocked = await isUserBlocked(creatorId, userId);

    if (!isAlreadyBlocked)
      throw new HttpsError("already-exists", "User is not blocked");

    await unblockUser(creatorId, userId);

    await logCreatorEvent({
      type: CreatorLogType.UNBLOCK_USER,
      creatorId,
      data: { userId },
    });

    const creator = await getUser(userId);

    if (!creator) throw new HttpsError("not-found", "User not found");

    await sendNotification({
      to: userId,
      data: {
        title: creator.displayName || creator.username || "Educator",
        message: "Unblocked you.",
        type: InAppNotificationType.USER_UNBLOCKED,
        iconType: InAppNotificationIconType.STORAGE,
        iconStorageUrl: creator.avatar_url,
        metadata: { creatorId, userId, creatorUsername: creator.username },
      },
    });

    return { blocked: false };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to block user");
  }
});
