import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logError } from "@/services/logging";
import { getAxiosInstance } from "@/services/apiClient";
import axios from "axios";
import rootReducer from "..";
import { CreatorDetailsState } from "../types";

const initialState: CreatorDetailsState = {
  creators: [],
  status: "idle",
  error: null,
};

export const fetchCreatorDetails = createAsyncThunk(
  "creatorDetails/fetchCreatorDetails",
  async (creatorId: string, { rejectWithValue }) => {
    try {
      const params = { creatorId };
      const axiosInstance = getAxiosInstance(true);
      const response = await axiosInstance.get("get-reel-creator-details", {
        params,
      });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch creator details";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const creatorDetailsSlice = createSlice({
  name: "creatorDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCreatorDetails.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        if (!action.payload) {
          logError("Failed to fetch profile data");
          return;
        }
        const exists = state.creators.find(
          (creator) => creator.id === action.payload?.id
        );

        // If the creator already exists in the state, update it
        if (exists) {
          state.creators = state.creators.map((creator) =>
            creator.id === action.payload?.id ? action.payload : creator
          );
          return;
        }
        // If the creator doesn't exist in the state, add it
        state.creators.push(action.payload);
      })
      .addCase(fetchCreatorDetails.rejected, (state, action) => {
        state.status = "errored";
        state.error = action.error.message || "Failed to fetch profile data";
      });
  },
});

// export const {} = creatorDetailsSlice.actions;

export default creatorDetailsSlice.reducer;

export const withCreatorDetailsSlice = rootReducer.inject(creatorDetailsSlice);
