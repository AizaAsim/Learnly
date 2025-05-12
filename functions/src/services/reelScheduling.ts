import { v4 as uuidv4 } from "uuid";
import {
  createQueueTask,
  deleteScheduledTask,
  updateScheduledTask,
} from "../shared/helpers/cloudTasks";
import { getFunctionUrl } from "../shared/helpers/functionsMetadata";
import { TasksQueueNames } from "../types/cloudTasks";
import { ReelData } from "../types/reels";
import { firestore } from "./firebaseAdmin";
import { logError, logInfo } from "./logging";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Updates the scheduled data of a reel in Firestore
 * @param reelId The reel ID
 * @param scheduledAt When the reel is scheduled to be published
 * @param scheduleTaskId The ID of the task that will publish the reel
 */
const updateReelTaskId = async (
  reelId: string,
  scheduleTaskId: string | undefined
) => {
  try {
    const reelDocRef = firestore.collection("reels").doc(reelId);
    await reelDocRef.update({
      scheduleTaskId: scheduleTaskId ? scheduleTaskId : FieldValue.delete(),
      // Remove scheduledAt if the task ID is removed
      ...(scheduleTaskId === undefined && { scheduledAt: FieldValue.delete() }),
    });
  } catch (error) {
    logError(`Error updating scheduled reel data ${reelId}`, error);
    throw error;
  }
};

/**
 * Create a new task to publish a scheduled reel
 * @param reelId The ID of the reel
 * @param userId The creator of the reel (needed in the task payload)
 * @param scheduledAt When to publish the reel
 * @returns The task ID of the scheduled reel
 */
export const createScheduledReelTask = async (reel: ReelData) => {
  logInfo("Creating task for scheduled reel", {
    reelId: reel.id,
    userId: reel.creatorId,
  });
  try {
    const url = await getFunctionUrl("http-videos-makeSchedulePostsActive");
    const payload = { postId: reel.id, userId: reel.creatorId };
    const taskId = uuidv4();
    await createQueueTask(
      TasksQueueNames.ReelScheduler,
      taskId,
      payload,
      url,
      reel.scheduledAt
    );
    await updateReelTaskId(reel.id, taskId);
    return taskId;
  } catch (error) {
    logError(`Error creating task for scheduled reel ${reel.id}`, error);
    throw error;
  }
};

/**
 * Updates the time to publish a scheduled reel
 * @param reelId The ID of the reel
 * @param newTime The updated time to publish the reel
 * @returns The "publish reel" task id of the scheduled reel
 */
export const updateScheduledReelTask = async (reel: ReelData) => {
  try {
    const { scheduleTaskId, scheduledAt } = reel;
    if (!scheduleTaskId || !scheduledAt) {
      throw new Error(
        "Scheduled reel does not have a task ID when trying to update"
      );
    }
    const { taskId } = await updateScheduledTask(
      TasksQueueNames.ReelScheduler,
      scheduleTaskId,
      scheduledAt
    );
    await updateReelTaskId(reel.id, taskId);
    return taskId;
  } catch (error) {
    logError(`Error updating task for scheduled reel ${reel.id}`, error);
    throw error;
  }
};

/**
 * Deletes the task that publishes a scheduled reel
 * @param reelId The ID of the reel
 */
export const deleteScheduledReelTask = async (reel: ReelData) => {
  try {
    const { scheduleTaskId } = reel;
    if (!scheduleTaskId) {
      throw new Error(
        "Scheduled reel does not have a task ID when trying to delete"
      );
    }
    await deleteScheduledTask(TasksQueueNames.ReelScheduler, scheduleTaskId);
    await updateReelTaskId(reel.id, undefined);
  } catch (error) {
    logError(`Error deleting task for scheduled reel ${reel.id}`, error);
    throw error;
  }
};
