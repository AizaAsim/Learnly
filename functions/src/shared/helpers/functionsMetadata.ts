import { projectID } from "firebase-functions/params";

/**
 * Check if the function is running in the Firebase Emulator.
 */
export const isFirebaseEmulator = process.env.FUNCTIONS_EMULATOR === "true";

/**
 * Get the URL of a given v2 cloud function.
 * @param {string} name the function's name
 * @return {Promise<string>} The URL of the function
 */
export const getFunctionUrl = async (name: string) => {
  const projectId = projectID.value();
  const location = process.env.PROJECT_LOCATION || "us-central1";
  const url = isFirebaseEmulator
    ? `http://localhost:5001/${projectId}/${location}/${name}`
    : `https://${location}-${projectId}.cloudfunctions.net/${name}`;
  return url;
};
