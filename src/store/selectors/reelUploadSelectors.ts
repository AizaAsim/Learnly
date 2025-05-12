import { stringToDate } from "@/lib/utils";
import { createSelector } from "@reduxjs/toolkit";
import { withReelUploadSlice } from "../reducers/reelUploadReducer";

export const selectUpload = withReelUploadSlice.selector(
  (state) => state.reelUpload
);

export const selectUploadId = createSelector(
  [selectUpload],
  (upload) => upload.uploadId
);

export const selectScheduleDateAsString = createSelector(
  [selectUpload],
  (upload) => upload.scheduleDate
);


export const selectScheduleTime = createSelector(
  [selectUpload],
  (upload) => upload.scheduleTime
);

export const selectTempScheduleDateAsString = createSelector(
  [selectUpload],
  (upload) => upload.tempScheduleDate
);

export const selectScheduleDate = createSelector(
  [selectScheduleDateAsString],
  (date) => (date ? stringToDate(date) : undefined)
);

export const selectTempScheduleDate = createSelector(
  [selectTempScheduleDateAsString],
  (date) => (date ? stringToDate(date) : undefined)
);

export const selectSelectedThumbnail = createSelector(
  [selectUpload],
  (upload) => upload.selectedThumbnail
);

export const selectThumbnails = createSelector(
  [selectUpload],
  (upload) => upload.thumbnails
);

export const selectVideo = createSelector(
  [selectUpload],
  (upload) => upload.video
);

export const selectPreviewVideos = createSelector([selectVideo], (video) =>
  video ? [video] : []
);

export const selectDescription = createSelector(
  [selectUpload],
  (upload) => upload.description
);

export const selectLink = createSelector(
  [selectUpload],
  (upload) => upload.link
);

export const selectFile = createSelector(
  [selectUpload],
  (upload) => upload.file
);
