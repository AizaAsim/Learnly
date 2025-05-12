import { addHours } from "date-fns";
import { Timestamp } from "firebase-admin/firestore";
import {
  createQueueTask,
  deleteScheduledTask,
} from "../shared/helpers/cloudTasks";
import { getFunctionUrl } from "../shared/helpers/functionsMetadata";
import { TasksQueueNames } from "../types/cloudTasks";
import { logError, logInfo } from "./logging";

const TEMP_VIDEO_AUTO_DELETE_HOURS = parseInt(
  process.env.TEMP_VIDEO_AUTO_DELETE_HOURS || "1",
  10
);

export const createTempReelCleanupTask = async (reelId: string) => {
  try {
    logInfo("Creating cleanup task for temp reel", { reelId });
    const url = await getFunctionUrl("http-videos-cleanUpExpiredTempPosts");
    const taskScheduleAt = addHours(new Date(), TEMP_VIDEO_AUTO_DELETE_HOURS);
    const taskScheduleAtTimestamp = Timestamp.fromDate(taskScheduleAt);
    const payload = { postId: reelId };
    const task = await createQueueTask(
      TasksQueueNames.TempPostGarbageCleaner,
      reelId,
      payload,
      url,
      taskScheduleAtTimestamp
    );
    return { task, taskScheduleAt, success: true };
  } catch (error) {
    logError(`Error creating temp reel cleanup task for reel ${reelId}`, error);
  }
  return { task: undefined, taskScheduledAt: undefined, success: false };
};

export const deleteTempReelCleanupTask = async (reelId: string) => {
  try {
    await deleteScheduledTask(TasksQueueNames.TempPostGarbageCleaner, reelId);
    logInfo(`Deleted cleanup task for temp reel ${reelId}`);
  } catch (error) {
    logError(`Error deleting cleanup task for temp reel ${reelId}`, error);
  }
};
