import { getCreatorEarningsData } from "@/features/Insights/services/callable";
import { MonthlyEarning } from "@/features/Insights/types";
import { logError } from "@/services/logging";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "..";
import { CreatorStatsState } from "../types";



const initialState: CreatorStatsState = {
  selectedMonth: new Date().toLocaleString("default", { month: "long" }),
  earnings: {
    monthlyData: [],
    loading: false,
    error: null,
  },
};

export const fetchEarningsStats = createAsyncThunk<
  MonthlyEarning[],
  void,
  { state: RootState }
>("creatorStats/fetchEarningsStats", async (_, { rejectWithValue }) => {
  try {
    const { data } = await getCreatorEarningsData();
    return data;
  } catch (error) {
    logError("Error fetching earnings data:", error);
    return rejectWithValue("Failed to fetch earnings stats");
  }
});

const creatorStatsSlice = createSlice({
  name: "creatorStats",
  initialState,
  reducers: {
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarningsStats.pending, (state) => {
        state.earnings.loading = true;
        state.earnings.error = null;
      })
      .addCase(fetchEarningsStats.fulfilled, (state, action) => {
        state.earnings.monthlyData = action.payload;
        state.earnings.loading = false;
      })
      .addCase(fetchEarningsStats.rejected, (state, action) => {
        state.earnings.loading = false;
        state.earnings.error = action.payload as string;
      });
  },
});

export const { setSelectedMonth } = creatorStatsSlice.actions;

export default creatorStatsSlice.reducer;

export const withCreatorStatsSlice = rootReducer.inject(creatorStatsSlice);
