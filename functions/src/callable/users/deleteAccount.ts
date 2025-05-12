import { addDays } from "date-fns";
import { Timestamp } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { auth } from "../../services/firebaseAdmin";
import { logError, logInfo } from "../../services/logging";
import { getUserRole } from "../../services/users";
import { createQueueTask } from "../../shared/helpers/cloudTasks";
import { getFunctionUrl } from "../../shared/helpers/functionsMetadata";
import { publishMessage } from "../../shared/helpers/pubsub";
import { TasksQueueNames } from "../../types/cloudTasks";
import { TopicType, UserAction } from "../../types/pubsub";
import { Roles } from "../../types/roles";

export const deleteAccount = onCall(corsOptions, async (request) => {
  const userId = request.auth?.uid;

  if (!userId) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }

  try {
    const role = await getUserRole(userId);

    // Queue the correct soft delete task based on the user role
    const action =
      role === Roles.CREATOR
        ? UserAction.SOFT_DELETE_CREATOR
        : UserAction.SOFT_DELETE_USER;
    await publishMessage(TopicType.USER_ACTION, {
      data: { userId },
      metadata: { action },
    });

    // Get the correct function URL based on the user role
    const funcName =
      role === Roles.CREATOR
        ? "http-user-deleteCreator"
        : "http-user-deleteUser";
    const url = await getFunctionUrl(funcName);

    // Schedule the hard delete task for 30 days from now
    const scheduleAt = Timestamp.fromDate(addDays(new Date(), 30));

    const taskPayload = { userId };
    const task = await createQueueTask(
      TasksQueueNames.DeleteUser,
      userId,
      taskPayload,
      url,
      scheduleAt
    );

    logInfo(`Created task ${task.name}`);

    // Delete the user account immediately
    await auth.deleteUser(userId);

    return { success: true };
  } catch (error) {
    logError(error);
    throw new HttpsError(
      "internal",
      `Failed to delete account: ${(error as Error).message}`
    );
  }
});
