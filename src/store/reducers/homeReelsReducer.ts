import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHomeReels } from "@/features/Profile/services/callable";
import { logError } from "@/services/logging";
import rootReducer from "..";
import { HomeReelsState } from "../types";

const initialState: HomeReelsState = {
  reels: [],
  status: "idle",
  error: null,
};

export const fetchHomeReels = createAsyncThunk(
  "homeReels/fetchHomeReels",
  async () => {
    const { data } = await getHomeReels();
    return data.reels;
  }
);

const homeReelsSlice = createSlice({
  name: "homeReels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeReels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHomeReels.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        if (!action.payload) {
          logError("Failed to fetch home reels");
          return;
        }
        state.reels = action.payload;
      })
      .addCase(fetchHomeReels.rejected, (state, action) => {
        state.status = "errored";
        state.error = action.error.message || "Failed to fetch home reels";
      });
  },
});

// export const {} = homeReelsSlice.actions;

export default homeReelsSlice.reducer;

export const withHomeReelsSlice = rootReducer.inject(homeReelsSlice);