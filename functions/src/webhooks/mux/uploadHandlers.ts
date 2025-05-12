import {
  VideoUploadAssetCreatedWebhookEvent,
  VideoUploadCancelledWebhookEvent,
  VideoUploadCreatedWebhookEvent,
  VideoUploadErroredWebhookEvent,
} from "@mux/mux-node/resources";
import { firestore } from "../../services/firebaseAdmin";
import { logError, logInfo } from "../../services/logging";
import { VideoStates } from "../../types/videoStatus";

export async function handleUploadCreated(
  event: VideoUploadCreatedWebhookEvent
) {
  const creatorId = event.data.new_asset_settings?.passthrough;
  if (!creatorId) {
    logError("No creator id found in 'upload created' webhook.", event);
    return;
  }
  const uploadId = event.data.id;
  if (!uploadId) {
    logError("No upload id found in 'upload created' webhook.", event);
    return;
  }

  const reelDoc = firestore.collection("reels").doc(uploadId);
  return reelDoc.set(
    {
      id: uploadId,
      creatorId,
      status: event.data.status,
      type: VideoStates.TEMP,
      deletedAt: null,
      isBlocked: false,
      uploaded_at: Math.floor(new Date().getTime() / 1000),
      thumbnailFrameSecond: 0,
    },
    { merge: true }
  );
}

export async function handleUploadAssetCreated(
  event: VideoUploadAssetCreatedWebhookEvent
) {
  const creatorId = event.data.new_asset_settings?.passthrough;
  if (!creatorId) {
    logError("No creator id found in 'upload asset created' webhook.", event);
    return;
  }
  const uploadId = event.data.id;
  if (!uploadId) {
    logError("No upload id found in 'upload asset created' webhook.", event);
    return;
  }

  const assetId = event.data.asset_id;
  if (!assetId) {
    logError("No asset id found in 'upload asset created' webhook.", event);
    return;
  }

  const reelDocRef = firestore.collection("reels").doc(uploadId);
  const reelDoc = await reelDocRef.get();

  if (!reelDoc.exists) {
    logError("No reel document found.", { uploadId });
    return;
  }

  const currentReelData = reelDoc.data();
  const newStatus =
    currentReelData && currentReelData.status === "ready"
      ? "ready"
      : event.data.status;

  return reelDocRef.set(
    {
      status: newStatus,
      assetId,
    },
    { merge: true }
  );
}

// TODO: Implement error flow
export async function handleUploadCancelled(
  event: VideoUploadCancelledWebhookEvent
) {
  const uploadId = event.data.id;
  if (!uploadId) {
    logError("No upload id found in 'upload cancelled' webhook.", event);
    return;
  }

  try {
    const reelDoc = firestore.collection("reels").doc(uploadId);
    await reelDoc.delete();
    logInfo("Upload Cancelled!", event);
  } catch (error) {
    logError(error);
  }
}

export async function handleUploadErrored(
  event: VideoUploadErroredWebhookEvent
) {
  const uploadId = event.data.id;
  if (!uploadId) {
    logError("No upload id found in 'upload errored' webhook.", event);
    return;
  }

  try {
    const reelDoc = firestore.collection("reels").doc(uploadId);
    await reelDoc.delete();
    logInfo("Upload Cancelled!", event);
  } catch (error) {
    logError(error);
  }
}
