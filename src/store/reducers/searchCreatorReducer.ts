import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { logError } from "@/services/logging";
import { getAxiosInstance } from "@/services/apiClient";
import axios from "axios";
import { SearchCreator } from "@/features/Search/types";
import rootReducer from "..";
import { SearchState } from "../types";

const initialState: SearchState = {
  isLoading: false,
  creators: [],
  hasMore: false,
  term: "",
  isEmpty: false,
  offset: 0,
};

const SEARCH_LIMIT = 10;

export const fetchCreatorsBySearch = createAsyncThunk(
  "search/fetchCreatorsBySearch",
  async (
    { searchTerm, resetList }: { searchTerm: string; resetList: boolean },
    { getState, rejectWithValue }
  ) => {
    if (!searchTerm) {
      return { data: { creators: [], hasMore: false }, resetList };
    }
    try {
      const state = getState() as { searchCreator: SearchState };
      const offset = resetList ? 0 : state.searchCreator.offset;

      const axiosInstance = getAxiosInstance(true);
      const response = await axiosInstance.get<SearchCreator>(
        "get-creators-by-term",
        {
          params: { term: searchTerm, offset },
        }
      );

      return { data: response.data, resetList };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to search creators"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const searchSlice = createSlice({
  name: "searchCreator",
  initialState,
  reducers: {
    setTerm: (state, action: PayloadAction<string>) => {
      state.term = action.payload;
    },
    resetOffset: (state) => {
      state.offset = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatorsBySearch.pending, (state) => {
        state.isLoading = true;
        state.isEmpty = false;
      })
      .addCase(fetchCreatorsBySearch.fulfilled, (state, action) => {
        const { data, resetList } = action.payload;
        state.isLoading = false;
        state.hasMore = data.hasMore;
        state.isEmpty = data.creators.length === 0;
        if (resetList) {
          state.creators = data.creators;
          state.offset = SEARCH_LIMIT;
        } else {
          state.creators = [...state.creators, ...data.creators];
          state.offset += SEARCH_LIMIT;
        }
      })
      .addCase(fetchCreatorsBySearch.rejected, (state, action) => {
        state.isLoading = false;
        state.hasMore = false;
        logError(action.error);
      });
  },
});

export const { setTerm, resetOffset } = searchSlice.actions;

export default searchSlice.reducer;

export const withSearchCreatorSlice = rootReducer.inject(searchSlice);