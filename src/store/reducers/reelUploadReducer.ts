import {
  cancelUpload,
  getThumbnailOptions,
} from "@/features/Videos/services/callable";
import { Thumbnail, VideoInfo } from "@/features/Videos/types";
import { firestore } from "@/services/firebase";
import { logError } from "@/services/logging";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, updateDoc } from "firebase/firestore";
import rootReducer from "..";
import { ReelUploadState } from "../types";

const initialState: ReelUploadState = {
  uploadId: null,
  scheduleDate: null,
  scheduleTime: null,
  tempScheduleDate: null,
  thumbnails: [],
  selectedThumbnail: null,
  video: null,
  description: "",
  link: "",
  file: null,
};

export const makeReelTypeCancel = createAsyncThunk(
  "reelUpload/makeReelTypeCancel",
  async (_, { getState }) => {
    const state = getState() as { reelUpload: ReelUploadState };
    const { video, uploadId } = state.reelUpload;

    try {
      if (uploadId && video?.status === "waiting") {
        await cancelUpload({ uploadId });
      }
      if (video?.id) {
        const reelRef = doc(firestore, `reels/${video.id}`);
        await updateDoc(reelRef, {
          type: "cancelled",
        });
      }
    } catch (error) {
      logError("Failed to discard post", error);
    }
  }
);

export const getThumbnails = createAsyncThunk(
  "reelUpload/getThumbnails",
  async (_, { getState }) => {
    const state = getState() as { reelUpload: ReelUploadState };
    const { uploadId } = state.reelUpload;

    if (!uploadId) throw "Upload id is null";
    const { data } = await getThumbnailOptions({ uploadId });
    return data;
  }
);

const reelUploadSlice = createSlice({
  name: "reelUpload",
  initialState,
  reducers: {
    setUploadId(state, action: PayloadAction<string | null>) {
      state.uploadId = action.payload;
    },
    setScheduleDate(state, action: PayloadAction<string>) {
      state.scheduleDate = action.payload;
    },
    setScheduleTime(state, action: PayloadAction<string>) {
      state.scheduleTime = action.payload;
    },
    setTempScheduleDate(state, action: PayloadAction<string>) {
      state.tempScheduleDate = action.payload;
    },
    setSelectedThumbnail(state, action: PayloadAction<Thumbnail | null>) {
      state.selectedThumbnail = action.payload;
    },
    setThumbnails(state, action: PayloadAction<Thumbnail[]>) {
      state.thumbnails = action.payload;
    },
    setVideo(state, action: PayloadAction<VideoInfo | null>) {
      state.video = action.payload;
    },
    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    setLink(state, action: PayloadAction<string>) {
      state.link = action.payload;
    },
    setFile(state, action: PayloadAction<File | null>) {
      state.file = action.payload;
    },
    resetUpload(state) {
      Object.assign(state, initialState);
    },
    resetScheduleDateTime(state) {
      state.scheduleDate = null;
      state.scheduleTime = null;
      state.tempScheduleDate = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(makeReelTypeCancel.fulfilled, (state) => {
      Object.assign(state, initialState);
    });
    builder.addCase(getThumbnails.fulfilled, (state, action) => {
      state.thumbnails = action.payload.thumbnails;
      state.selectedThumbnail = action.payload.thumbnails[0];
    });
  },
});

export const {
  setUploadId,
  setScheduleDate,
  setScheduleTime,
  setTempScheduleDate,
  setThumbnails,
  setSelectedThumbnail,
  setVideo,
  setDescription,
  setLink,
  resetUpload,
  setFile,
  resetScheduleDateTime,
} = reelUploadSlice.actions;

export default reelUploadSlice.reducer;

export const withReelUploadSlice = rootReducer.inject(reelUploadSlice);