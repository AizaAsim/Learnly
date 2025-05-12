import { getSavedReels } from "@/features/Profile/services/callable";
import { logError } from "@/services/logging";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "..";
import { SavedReelsState } from "../types";

const initialState: SavedReelsState = {
  reels: [],
  status: "idle",
  error: null,
  hasMore: true,
  lastDocId: null,
};

export const fetchSavedReels = createAsyncThunk(
  "savedReels/fetchSavedReels",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const lastDocId = state.savedReels?.lastDocId;
    const { data } = await getSavedReels({ lastDocId: lastDocId || undefined });
    return data;
  }
);

const savedReelsSlice = createSlice({
  name: "savedReels",
  initialState,
  reducers: {
    clearSavedReels(state) {
      state.reels = [];
      state.status = "idle";
      state.error = null;
      state.hasMore = true;
      state.lastDocId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedReels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSavedReels.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        if (!action.payload) {
          logError("Failed to fetch saved reels");
          return;
        }
        state.reels = [...state.reels, ...action.payload.reels];
        state.hasMore = action.payload.hasMore;
        state.lastDocId = action.payload.lastDocId || null;
      })
      .addCase(fetchSavedReels.rejected, (state, action) => {
        state.status = "errored";
        state.error = action.error.message || "Failed to fetch saved reels";
      });
  },
});

export const { clearSavedReels } = savedReelsSlice.actions;

export default savedReelsSlice.reducer;

export const withSavedReelsSlice = rootReducer.inject(savedReelsSlice);