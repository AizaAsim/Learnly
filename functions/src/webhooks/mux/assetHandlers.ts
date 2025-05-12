import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetUpdatedWebhookEvent,
} from "@mux/mux-node/resources";
import { firestore } from "../../services/firebaseAdmin";
import { logError, logInfo, logMessage } from "../../services/logging";

export async function handleAssetCreated(event: VideoAssetCreatedWebhookEvent) {
  const uploadId = event.data.upload_id;
  if (!uploadId) {
    logError("No upload id found in 'asset created' webhook.", event);
    return;
  }

  const assetId = event.data.id;
  if (!assetId) {
    logError("No asset id found in 'asset created' webhook.", event);
    return;
  }

  const reelDoc = await firestore.collection("reels").doc(uploadId).get();

  if (!reelDoc.exists) {
    logError("EduClip not found in 'asset created' webhook.", event);
  }

  return reelDoc.ref.update({
    assetId,
    status: event.data.status,
  });
}

export async function handleVideoReady(event: VideoAssetReadyWebhookEvent) {
  const uploadId = event.data.upload_id;
  if (!uploadId) {
    logError("No upload id found in 'asset created' webhook.", event);
    return;
  }

  const reelDoc = await firestore.collection("reels").doc(uploadId).get();

  if (!reelDoc.exists) {
    logError("EduClip not found in 'video ready' webhook.", event);
    return;
  }

  return reelDoc.ref.update({
    status: event.data.status,
    duration: event.data.duration,
    playbackIds: event.data.playback_ids,
    aspect: event.data.aspect_ratio,
    uploaded_at: event.data.created_at,
  });
}

export async function handleVideoDeleted(event: VideoAssetDeletedWebhookEvent) {
  const { data } = event;
  const uploadId = data.upload_id;
  if (!uploadId) {
    logError("No upload id found in 'asset created' webhook.", event);
    return;
  }
  const reelDoc = firestore.collection("reels").doc(uploadId);
  const docSnapshot = await reelDoc.get();

  if (docSnapshot.exists) {
    await reelDoc.delete();
    logInfo(`Video deleted!`, {
      user: data.passthrough,
      video: data.id,
    });
  } else {
    logError("EduClip not found for deletion", event);
  }
  return;
}

export async function handleVideoErrored(event: VideoAssetErroredWebhookEvent) {
  logMessage(event);
  const uploadId = event.data.upload_id;
  if (!uploadId) {
    logError("No upload id found in 'video errored' webhook.", event);
    return;
  }

  const reelDoc = await firestore.collection("reels").doc(uploadId).get();

  if (!reelDoc.exists) {
    logError("Temp video not found in 'video errored' webhook.", event);
    return;
  }

  return reelDoc.ref.update({
    status: event.data.status,
    errorType: event.data.errors?.type,
  });
}

export async function handleVideoUpdated(event: VideoAssetUpdatedWebhookEvent) {
  // TODO: Investigate if our use-case needs this
  logMessage(event);
  return;
}
