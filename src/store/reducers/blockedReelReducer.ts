import { getReelById } from "@/features/Videos/services/callable";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "..";
import { BlockedReelState } from "../types";

const initialState: BlockedReelState = {
  reelId: "",
  reel: null,
  status: "idle",
  error: null,
};

export const fetchBlockedReel = createAsyncThunk(
  "blockedReels/fetchBlockedReels",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const reelId = state.blockedReel?.reelId;
    if (!reelId) {
      return null;
    }
    const { data } = await getReelById({ reelId });
    return data;
  }
);

const blockedReelSlice = createSlice({
  name: "blockedReels",
  initialState,
  reducers: {
    setBlockedReelId(state, action) {
      state.reelId = action.payload;
    },
    clearBlockedReel(state) {
      state.reel = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockedReel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlockedReel.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.reel = action.payload;
      })
      .addCase(fetchBlockedReel.rejected, (state, action) => {
        state.status = "errored";
        state.error = action.error.message || "Failed to fetch saved reels";
      });
  },
});

export const { clearBlockedReel, setBlockedReelId } = blockedReelSlice.actions;

export default blockedReelSlice.reducer;

export const withBlockedReelSlice = rootReducer.inject(blockedReelSlice);
