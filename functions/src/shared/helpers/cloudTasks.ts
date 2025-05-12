import { CloudTasksClient } from "@google-cloud/tasks";
import { google } from "@google-cloud/tasks/build/protos/protos";
import { Timestamp } from "firebase-admin/firestore";
import { projectID } from "firebase-functions/params";
import { v4 as uuidv4 } from "uuid";
import { TasksQueueNames } from "../../types/cloudTasks";
import { logError } from "../../services/logging";

// Helper function to initialize CloudTasksClient and retrieve project and location.
const initializeClient = () => {
  const project = projectID.value();
  const location = process.env.PROJECT_LOCATION || "us-central1";
  const client = new CloudTasksClient();
  return { project, location, client };
};

/**
 * Creates a task in a Cloud Tasks queue.
 * @param {TasksQueueNames} queue - The name of the Cloud Tasks queue.
 * @param {string} taskId - The unique identifier for the task.
 * @param {Record<string, unknown>} payload - The payload to be sent with the task.
 * @param {string} functionUrl - The URL of the Cloud Function to invoke.
 * @param {Timestamp} [scheduleTime] - Optional. The time at which the task is scheduled to run.
 * @returns {Promise<google.cloud.tasks.v2.ITask>} The created task.
 * @throws {Error} - Throws an error if the task creation fails.
 */
export const createQueueTask = async (
  queue: TasksQueueNames,
  taskId: string,
  payload: Record<string, unknown>,
  functionUrl: string,
  scheduleTime?: Timestamp
): Promise<google.cloud.tasks.v2.ITask> => {
  const { project, location, client } = initializeClient();

  try {
    // Construct the fully qualified queue name.
    const parent = client.queuePath(project, location, queue);

    // Create task request.
    const taskRequest: google.cloud.tasks.v2.ITask = {
      name: client.taskPath(project, location, queue, taskId),
      httpRequest: {
        httpMethod: google.cloud.tasks.v2.HttpMethod.POST,
        url: functionUrl,
        body: Buffer.from(JSON.stringify(payload)).toString("base64"),
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    if (scheduleTime) {
      taskRequest.scheduleTime = {
        seconds: scheduleTime.seconds,
        nanos: scheduleTime.nanoseconds,
      };
    }

    // Create the task in the queue.
    const [task] = await client.createTask({ parent, task: taskRequest });

    return task;
  } catch (error) {
    logError(error);
    throw new Error(`Failed to create task in queue ${queue}: ${error}`);
  }
};

/**
 * Deletes a task from a Cloud Tasks queue.
 * @param {TasksQueueNames} queue - The name of the Cloud Tasks queue.
 * @param {string} taskId - The unique identifier for the task.
 * @returns {Promise<void>}
 * @throws {Error} If the task deletion fails.
 */
export const deleteScheduledTask = async (
  queue: TasksQueueNames,
  taskId: string
): Promise<void> => {
  const { project, location, client } = initializeClient();

  try {
    // Construct the fully qualified task name.
    const name = client.taskPath(project, location, queue, taskId);
    // Delete the task.
    await client.deleteTask({ name });
  } catch (error) {
    logError(error);
    throw new Error(
      `Failed to delete task ${taskId} from queue ${queue}: ${error}`
    );
  }
};

/**
 * Updates the schedule time of a task in a Cloud Tasks queue.
 * @param {TasksQueueNames} queue - The name of the Cloud Tasks queue.
 * @param {string} taskId - The unique identifier for the task.
 * @param {Timestamp} scheduleTime - The new schedule time for the task.
 * @returns {Promise<{updatedTask: google.cloud.tasks.v2.ITask, taskId: string}>} The updated task and its ID.
 * @throws {Error} If the task update fails.
 */
export const updateScheduledTask = async (
  queue: TasksQueueNames,
  taskId: string,
  scheduleTime: Timestamp
): Promise<{ updatedTask: google.cloud.tasks.v2.ITask; taskId: string }> => {
  const { project, location, client } = initializeClient();
  const parent = client.queuePath(project, location, queue);
  const oldTaskName = client.taskPath(project, location, queue, taskId);

  try {
    // Get the task from the queue
    const [task] = await client.getTask({ name: oldTaskName });

    // Delete the old task from the queue
    await client.deleteTask({ name: oldTaskName });

    // Create a new task with updated schedule time
    const newTaskId = uuidv4();
    const newTaskName = client.taskPath(project, location, queue, newTaskId);

    task.scheduleTime = {
      seconds: scheduleTime.seconds,
      nanos: scheduleTime.nanoseconds,
    };
    task.name = newTaskName;

    // Add the new task copy to the queue
    const [updatedTask] = await client.createTask({ parent, task });

    return { updatedTask, taskId: newTaskId };
  } catch (error) {
    logError(error);
    throw new Error(
      `Failed to update task ${taskId} in queue ${queue}: ${error}`
    );
  }
};
