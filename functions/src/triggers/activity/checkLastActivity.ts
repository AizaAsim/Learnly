import { onSchedule } from "firebase-functions/v2/scheduler";
import { logError, logInfo } from "../../services/logging";
import {
  getInactiveUsers,
  getRenotifyUsers,
  markUserNotified,
  sendInactivityEmail,
} from "../../services/activity";
import { EmailDynamicDataType, EmailType } from "../../types/pubsub";
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "../../services/firebaseAdmin";
import { getUserRole } from "../../services/users";
import { createQueueTask } from "../../shared/helpers/cloudTasks";
import { getFunctionUrl } from "../../shared/helpers/functionsMetadata";
import { publishMessage } from "../../shared/helpers/pubsub";
import { TasksQueueNames } from "../../types/cloudTasks";
import { TopicType, UserAction } from "../../types/pubsub";
import { Roles } from "../../types/roles";
import { addDays } from "date-fns";
export const checkInactiveUsers = onSchedule("0 0 * * *", async () => {
  try {
    logInfo("Checking for users inactive for more than 6 months...");

    const inactiveUsers = await getInactiveUsers(6);
    const reNotifyUsersFor30Days = await getRenotifyUsers(6, 60);
    const reNotifyUsersFor7Days = await getRenotifyUsers(6, 83);
    const reNotifyUsersFor1Day = await getRenotifyUsers(6, 89);
    const deleteAccountUsers = await getRenotifyUsers(6, 90);

    if (inactiveUsers && inactiveUsers.length > 0) {
      for (const user of inactiveUsers) {
        try {
          const emailData: EmailDynamicDataType = {
            type: EmailType.ACCOUNT_INACTIVE,
            helpCenterUrl: "",
          };
          await sendInactivityEmail(user.id, emailData);
          await markUserNotified(user.id);
        } catch (emailError) {
          logError(`Failed to process inactive user ${user.id}:`, emailError);
        }
      }
    } else {
      logInfo("No inactive users found.");
    }

    if (reNotifyUsersFor30Days && reNotifyUsersFor30Days.length > 0) {
      for (const user of reNotifyUsersFor30Days) {
        try {
          const emailData: EmailDynamicDataType = {
            type: EmailType.ACCOUNT_CLOSE_TO_DELETION,
            helpCenterUrl: "",
          };
          await sendInactivityEmail(user.id, emailData);
        } catch (emailError) {
          logError(
            `Failed to re-notify user ${user.id} (30 days):`,
            emailError
          );
        }
      }
    }

    if (reNotifyUsersFor7Days && reNotifyUsersFor7Days.length > 0) {
      for (const user of reNotifyUsersFor7Days) {
        try {
          const emailData: EmailDynamicDataType = {
            type: EmailType.WARNING,
            helpCenterUrl: "",
          };
          await sendInactivityEmail(user.id, emailData);
        } catch (emailError) {
          logError(`Failed to re-notify user ${user.id} (7 days):`, emailError);
        }
      }
    }

    if (reNotifyUsersFor1Day && reNotifyUsersFor1Day.length > 0) {
      for (const user of reNotifyUsersFor1Day) {
        try {
          const emailData: EmailDynamicDataType = {
            type: EmailType.LAST_CHANCE,
            helpCenterUrl: "",
          };
          await sendInactivityEmail(user.id, emailData);
        } catch (emailError) {
          logError(`Failed to re-notify user ${user.id} (1 day):`, emailError);
        }
      }
    }

    if (deleteAccountUsers && deleteAccountUsers.length > 0) {
      for (const user of deleteAccountUsers) {
        try {
          const userId = user.id;

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

          await auth.deleteUser(userId);
          const emailData: EmailDynamicDataType = {
            type: EmailType.ACCOUNT_DELETED,
          };
          await sendInactivityEmail(user.id, emailData);
          logInfo(`Account deleted for user ${user.id}.`);
        } catch (error) {
          logError(`Failed to delete account for user ${user.id}:`, error);
        }
      }
    }
  } catch (error) {
    logError("Error checking inactive users:", error);
    throw new Error("Failed to check inactive users.");
  }
});
