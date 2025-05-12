import { onRequest } from "firebase-functions/v2/https";
import { verifyWebhook } from "../../services/mux";
import { VideoAssetWebhookEvent } from "../../types/webhooks";
import { logError, logInfo, logWarning } from "../../services/logging";
import {
  handleUploadAssetCreated,
  handleUploadCancelled,
  handleUploadCreated,
  handleUploadErrored,
} from "./uploadHandlers";
import {
  handleAssetCreated,
  handleVideoDeleted,
  handleVideoErrored,
  handleVideoReady,
  handleVideoUpdated,
} from "./assetHandlers";

/**
 * HAPPY PATH
 * 1. video.upload.created
 * 2. video.asset.created
 * 3. video.upload.asset_created
 * 4. video.asset.ready
 */

export const mux = onRequest(async (request, response) => {
  try {
    if (!verifyWebhook(request)) {
      logInfo("Unauthorized webhook request.", request.headers, request.body);
      response.status(401).send("Unauthorized");
      return;
    }

    const data = request.body;
    const eventType = data.type;
    logWarning(eventType, data);

    switch (eventType) {
      case "video.upload.created":
        await handleUploadCreated(data);
        break;
      case "video.asset.created":
        await handleAssetCreated(data);
        break;
      case "video.upload.asset_created":
        await handleUploadAssetCreated(data);
        break;
      case "video.upload.cancelled":
        await handleUploadCancelled(data);
        break;
      case "video.upload.errored":
        await handleUploadErrored(data);
        break;
      case "video.asset.ready":
        await handleVideoReady(data);
        break;
      case "video.asset.updated":
        await handleVideoUpdated(data);
        break;
      case "video.asset.deleted":
        await handleVideoDeleted(data);
        break;
      case "video.asset.errored":
        await handleVideoErrored(data);
        break;
      default:
        handleEventMiss(data);
    }

    response.status(200).send();
    return;
  } catch (error) {
    logError(error);
    response.status(500).send("Something went wrong!");
  }
});

function handleEventMiss(event: VideoAssetWebhookEvent) {
  logInfo(
    `No handler set up for type ${event.type} but received webhook event.`
  );
}
