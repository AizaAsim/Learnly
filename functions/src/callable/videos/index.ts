import { getUploadUrl } from "./getUploadUrl";
import { getTokens } from "./getTokens";
import { cancelUpload } from "./cancelUpload";
import { handleVideoState } from "./handleVideoState";
import { getMyVideos } from "./getMyVideos";
import { getCreatorVideos } from "./getCreatorVideos";
import { getMyVideosCount } from "./getMyVideosCount";
import { getThumbnailOptions } from "./getThumbnailOptions";

export const videos = {
  getUploadUrl,
  getTokens,
  cancelUpload,
  handleVideoState,
  getMyVideos,
  getCreatorVideos,
  getMyVideosCount,
  getThumbnailOptions,
};
