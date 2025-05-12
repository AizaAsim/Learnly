import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCreatorVideos } from "@/features/Profile/services/callable";
import { getAxiosInstance } from "@/services/apiClient";
import axios from "axios";
import { getCreatorSubscriptionInfo } from "@/features/Stripe/services/callable";
import rootReducer from "..";
import { CreatorProfileState } from "../types";

const initialState: CreatorProfileState = {
  profileData: null,
  creatorVideos: [],
  isSubscribed: false,
  isPastDue: false,
  isCreatorAccountDeleted: false,
  creatorId: null,
  username: null,
  profileLoading: false,
  profileError: null,
  videosLoading: false,
  videosError: null,
  email: null,
};

export const fetchCreatorProfile = createAsyncThunk(
  "creatorProfile/fetchProfile",
  async (username: string, { rejectWithValue }) => {
    try {
      const params = { creatorUsername: username };
      const axiosInstance = getAxiosInstance(true);
      // Fetch data concurrently
      const [profileResponse, subscriptionData] = await Promise.all([
        axiosInstance.get("get-creator-profile-data", { params }),
        getCreatorSubscriptionInfo({ creatorUsername: username }),
      ]);
      return { ...profileResponse.data, ...subscriptionData.data };
    } catch (error) {
      let errorMessage = "Failed to fetch creator profile";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCreatorVideos = createAsyncThunk(
  "creatorProfile/fetchVideos",
  async (username: string) => {
    const { data } = await getCreatorVideos({ creatorUsername: username });
    return data;
  }
);

const creatorProfileSlice = createSlice({
  name: "creatorProfile",
  initialState,
  reducers: {
    addBio: (state, action: PayloadAction<string>) => {
      if (state.profileData) state.profileData.bio = action.payload;
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    updateCancelAtPeriodEnd: (state, action: PayloadAction<boolean>) => {
      if (state.profileData)
        state.profileData.cancelAtPeriodEnd = action.payload;
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateIsSubscribed: (state, action: PayloadAction<boolean>) => {
      state.isSubscribed = action.payload;
    },
    updateIsPastDue: (state, action: PayloadAction<boolean>) => {
      state.isPastDue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchCreatorProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.isSubscribed = action.payload.isSubscribed;
        state.isPastDue = action.payload.isPastDue;
        state.isCreatorAccountDeleted = action.payload.isCreatorAccountDeleted;
        state.profileData = action.payload;
      })
      .addCase(fetchCreatorProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError =
          action.error.message || "Failed to fetch profile data";
      })
      .addCase(fetchCreatorVideos.pending, (state) => {
        state.videosLoading = true;
        state.videosError = null;
      })
      .addCase(fetchCreatorVideos.fulfilled, (state, action) => {
        state.videosLoading = false;
        state.creatorVideos = action.payload.creatorVideos;
        state.isSubscribed = action.payload.isSubscribed;
        state.isPastDue = action.payload.isPastDue;
        state.creatorId = action.payload.creatorId;
      })
      .addCase(fetchCreatorVideos.rejected, (state, action) => {
        state.videosLoading = false;
        state.videosError =
          action.error.message || "Failed to fetch creator videos";
      });
  },
});

export const {
  addBio,
  updateUsername,
  updateCancelAtPeriodEnd,
  updateEmail,
  updateIsPastDue,
  updateIsSubscribed,
} = creatorProfileSlice.actions;

export default creatorProfileSlice.reducer;

export const withCreatorProfileSlice = rootReducer.inject(creatorProfileSlice);
