import { getMyProfileData } from "@/features/Profile/services/callable";
import { MyProfileData } from "@/features/Profile/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import rootReducer from "..";
import { MyProfileState } from "../types";

const profileSlice = createSlice({
  name: "myProfile",
  initialState: {
    counts: {
      active: 0,
      likes: 0,
      // bookmarks: 0,
      views: 0,
    },
    status: "idle",
    error: null,
  } as MyProfileState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMyProfileData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchMyProfileData.fulfilled, (state, action) => {
      const payload = action.payload as MyProfileData;
      state.status = "idle";
      state.counts = payload.counts;
      state.lastUpdated = Date.now();
    });
    builder.addCase(fetchMyProfileData.rejected, (state, action) => {
      state.status = "idle";
      state.error = action.error;
    });
  },
});

export const fetchMyProfileData = createAsyncThunk(
  "myProfile/fetchMyProfileData",
  async () => {
    const { data } = await getMyProfileData();
    return data;
  }
);

// export const {  } = profileSlice.actions;

export default profileSlice.reducer;

export const withMyProfileSlice = rootReducer.inject(profileSlice);

