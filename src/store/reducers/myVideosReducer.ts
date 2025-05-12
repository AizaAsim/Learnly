import { getMyVideoData } from "@/features/Profile/services/callable";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import rootReducer from "..";
import { MyVideosState } from "../types";

const myVideosSlice = createSlice({
  name: "myVideos",
  initialState: {
    reels: [],
    status: "idle",
    error: null,
    lastUpdated: 0,
  } as MyVideosState,
  reducers: {
    updateReel: (state, action) => {
      const { id, data } = action.payload;
      state.reels = state.reels.map((item) =>
        item.id === id ? { ...item, ...data } : item
      );
    },
    deleteReel: (state, action) => {
      const id = action.payload;
      state.reels = state.reels.filter((item) => item.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyVideoData.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMyVideoData.fulfilled, (state, action) => {
      const payload = action.payload;
      state.status = "idle";
      state.reels = payload.reels;
      state.lastUpdated = Date.now();
    });
    builder.addCase(fetchMyVideoData.rejected, (state, action) => {
      state.status = "errored";
      state.error = action.error;
    });
  },
});

export const fetchMyVideoData = createAsyncThunk(
  "myVideos/fetchMyVideoData",
  async () => {
    const { data } = await getMyVideoData();
    return data;
  }
);

export const { updateReel, deleteReel } = myVideosSlice.actions;

export default myVideosSlice.reducer;

export const withMyVideoSlice = rootReducer.inject(myVideosSlice);
