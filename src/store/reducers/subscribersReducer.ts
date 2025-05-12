import { Subscriber } from "@/features/Stripe/types";
import { getAxiosInstance } from "@/services/apiClient";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import rootReducer, { RootState } from "..";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { logError } from "@/services/logging";
import { SubscribersSliceState } from "../types";

const initialState: SubscribersSliceState = {
  learners: [],
  status: "idle",
  error: null,
  hasMore: true,
  numberOfSubscribers: 0,
};

export const fetchSubscribers = createAsyncThunk(
  "learners/fetchSubscribers",
  async (
    { searchTerm, resetList }: { searchTerm: string; resetList: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const learners = state.learners?.learners ?? [];
      const params = {
        query: searchTerm,
        offset: resetList ? 0 : learners.length,
      };
      const axiosInstance = getAxiosInstance();
      const response = await axiosInstance.get<{
        learners: Subscriber[];
        hasMore: boolean;
      }>("http-views-getCreatorSubscribersList", { params });

      return {
        learners: response.data.learners,
        hasMore: response.data.hasMore,
        resetList,
      };
    } catch (error) {
      let errorMessage = "Failed to fetch learners";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchNumberOfSubscribers = createAsyncThunk(
  "learners/fetchNumberOfSubscribers",
  async (creatorId: string, { rejectWithValue }) => {
    try {
      const coll = collection(firestore, "learners");
      const q = query(
        coll,
        where("creatorId", "==", creatorId),
        where("status", "in", ["active", "trialing"])
      );
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      logError(error);
      return rejectWithValue("Failed to fetch subscriber count");
    }
  }
);

const subscribersFiltersSlice = createSlice({
  name: "learners",
  initialState,
  reducers: {
    removeSubscriber(state, action: PayloadAction<string>) {
      state.learners = state.learners.filter(
        (subscriber) => subscriber.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hasMore = action.payload.hasMore ?? false;
        state.learners = action.payload.resetList
          ? action.payload.learners ?? []
          : [
              // Make sure a result being undefined doesn't broke everything
              ...(state.learners ?? []),
              ...(action.payload.learners ?? []),
            ];
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch learners";
      })
      .addCase(fetchNumberOfSubscribers.fulfilled, (state, action) => {
        state.numberOfSubscribers = action.payload ?? 0;
      })
      .addCase(fetchNumberOfSubscribers.rejected, (state) => {
        state.numberOfSubscribers = 0;
      });
  },
});

export const { removeSubscriber } = subscribersFiltersSlice.actions;

export default subscribersFiltersSlice.reducer;

export const withSubscriberFilterSlice = rootReducer.inject(
  subscribersFiltersSlice
);
