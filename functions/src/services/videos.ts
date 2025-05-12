import { firestore } from "./firebaseAdmin";
import { logError } from "./logging";
import { HttpsError } from "firebase-functions/v2/https";
import { differenceInCalendarDays, isPast } from "date-fns";
import { Timestamp } from "firebase-admin/firestore";
import { deleteAsset } from "./mux";
import { VideoStates } from "../types/videoStatus";
import { ReelData } from "../types/reels";

interface ReelPayload {
  link?: string;
  description?: string;
  scheduledAt?: Date;
  publishedAt?: Date;
}

const getMaxDraftLimit = () => {
  const limit = process.env.MAX_DRAFTS_REELS_PER_USER;
  if (!limit) {
    logError("Max draft reels per user is not set.");
    throw new HttpsError("internal", "Something went wrong.");
  }
  return parseInt(limit);
};

const getMaxScheduledLimit = () => {
  const limit = process.env.MAX_SCHEDULED_REELS_PER_USER;
  if (!limit) {
    logError("Max scheduled reels per user is not set.");
    throw new HttpsError("internal", "Something went wrong.");
  }
  return parseInt(limit);
};

const getNoOfReels = async (uid: string, type: VideoStates) => {
  const colRef = firestore
    .collection("reels")
    .where("creatorId", "==", uid)
    .where("type", "==", type)
    .where("isBlocked", "==", false);

  const snapshot = await colRef.count().get();
  return snapshot.data().count;
};

/**
 * Helper function to get the reel document data
 * @param uid The ID of the user
 * @param reelId The ID of the reel
 * @returns The reel document data
 * @throws HttpsError if the reel document does not exist
 */
export const getReelDoc = async (reelId: string) => {
  const reelDocRef = firestore.collection("reels").doc(reelId);
  const reelDoc = await reelDocRef.get();

  if (!reelDoc.exists) {
    throw new HttpsError("not-found", "EduClip not found");
  }

  return reelDoc.data() as ReelData;
};

/**
 * Update the type of a temp video to draft and save new data
 * @param uid The ID of the user
 * @param videoId The ID of the video to draft
 * @throws {HttpsError} If the draft limit is reached.
 * @throws {HttpsError} If the reel does not exist.
 * @throws {HttpsError} If the user is not authorized to draft the reel.
 * @returns Promise<void> A promise that resolves when the reel has been successfully drafted.
 */
export const draftTempVideo = async (
  uid: string,
  videoId: string,
  reelData: ReelPayload
) => {
  const noOfDrafts = await getNoOfReels(uid, VideoStates.DRAFT);
  if (noOfDrafts >= getMaxDraftLimit()) {
    throw new HttpsError("resource-exhausted", "Draft limit reached");
  }
  const reelDocRef = firestore.collection("reels").doc(videoId);
  const reelDoc = await reelDocRef.get();

  if (!reelDoc.exists) {
    throw new HttpsError("not-found", "EduClip not found");
  }

  const tempReelData = reelDoc.data();

  if (tempReelData?.creatorId !== uid) {
    throw new HttpsError(
      "permission-denied",
      "Not authorized to draft this reel"
    );
  }

  if (tempReelData?.type !== VideoStates.TEMP) {
    throw new HttpsError("permission-denied", "EduClip is not in a temp state");
  }

  await reelDocRef.set(
    {
      ...tempReelData,
      ...reelData,
      type: VideoStates.DRAFT,
    },
    { merge: true }
  );
};

/**
 * Schedules a temp video by updating its type to scheduled in the reels collection
 * @param uid The ID of the user
 * @param videoId The ID of the video to schedule
 * @param reelData The data to update for the video
 * @returns Promise<void>
 */
export const scheduleTempVideo = async (
  uid: string,
  videoId: string,
  reelData: ReelPayload
) => {
  const noOfScheduledReels = await getNoOfReels(uid, VideoStates.SCHEDULED);
  if (noOfScheduledReels >= getMaxScheduledLimit()) {
    throw new HttpsError("resource-exhausted", "Scheduled limit reached");
  }

  const reelDocRef = firestore.collection("reels").doc(videoId);
  const reelDoc = await reelDocRef.get();

  if (!reelDoc.exists) {
    throw new HttpsError("not-found", "EduClip not found");
  }

  const existingReelData = reelDoc.data();

  if (existingReelData?.creatorId !== uid) {
    throw new HttpsError(
      "permission-denied",
      "Not authorized to schedule this reel"
    );
  }

  if (existingReelData?.type !== VideoStates.TEMP) {
    throw new HttpsError("permission-denied", "EduClip is not in a temp state");
  }

  if (!reelData.scheduledAt) {
    throw new HttpsError(
      "invalid-argument",
      "Scheduled date is missing in the request data"
    );
  }

  const scheduledAt = new Date(reelData.scheduledAt);

  if (isPast(scheduledAt)) {
    throw new HttpsError("invalid-argument", "Scheduled date is in the past");
  }

  const today = new Date();
  const difference = differenceInCalendarDays(scheduledAt, today);
  if (difference > 60) {
    throw new HttpsError(
      "invalid-argument",
      "Scheduled date is more than 30 days from today"
    );
  }

  const scheduledAtTimestamp = Timestamp.fromDate(scheduledAt);

  await reelDocRef.set(
    {
      ...existingReelData,
      ...reelData,
      type: VideoStates.SCHEDULED,
      scheduledAt: scheduledAtTimestamp,
    },
    { merge: true }
  );
};

/**
 * Deletes a temp doc for a reel
 * @param reelId The ID of the EduClip to delete
 * @returns Promise<void>
 */
export const deleteReelDoc = async (reelId: string) => {
  try {
    const reelDocRef = firestore.collection("reels").doc(reelId);
    await reelDocRef.delete();
  } catch (error) {
    logError("Error deleting reel doc:", error);
    throw new HttpsError("internal", "Failed to delete reel doc");
  }
};

/**
 * Publishes a reel by updating its status to "active" and setting the publication date.
 * If additional reel data is provided, it will be merged with the existing data.
 * @param {string} reelId - The ID of the reel to be published.
 * @param {string} userId - The ID of the user who owns the reel.
 * @param {ReelData} [reelData] - Optional additional data to be merged with the existing reel data.
 * @returns {Promise<void>} A promise that resolves when the reel is successfully published.
 */
export const makeReelActive = async (
  reelId: string,
  userId: string,
  reelData?: ReelPayload
) => {
  const reelDocRef = firestore.collection("reels").doc(reelId);
  const reelDoc = await reelDocRef.get();

  if (!reelDoc.exists) {
    throw new HttpsError("not-found", "EduClip not found");
  }

  const existingReelData = reelDoc.data();

  if (existingReelData?.creatorId !== userId) {
    throw new HttpsError(
      "permission-denied",
      "Not authorized to publish this reel"
    );
  }

  await reelDocRef.set(
    {
      ...existingReelData,
      ...reelData,
      type: VideoStates.ACTIVE,
      publishedAt: new Date(),
    },
    { merge: true }
  );
};

/**
 * Deletes all reels documents for a creator and their associated assets from Mux
 * @param creatorId The ID of the creator
 * @returns Promise<void>
 */
export const deleteAllReelsForCreator = async (creatorId: string) => {
  const reelsRef = firestore.collection("reels");
  const snapshot = await reelsRef.where("creatorId", "==", creatorId).get();

  if (snapshot.empty) return;

  const batch = firestore.batch();

  for (const doc of snapshot.docs) {
    const { assetId } = doc.data();
    if (assetId) await deleteAsset(assetId);
    batch.delete(doc.ref);
  }

  await batch.commit();
};
