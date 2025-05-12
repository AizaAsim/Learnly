import { createSelector } from "@reduxjs/toolkit";
import { withCreatorStatsSlice } from "../reducers/creatorStatsReducer";

export const selectCreatorStats = withCreatorStatsSlice.selector((state) => state.creatorStats);

export const selectSelectedMonth = createSelector(
  [selectCreatorStats],
  (stats) => stats.selectedMonth
);

export const selectEarningsStats = createSelector(
  [selectCreatorStats],
  (stats) => stats.earnings
);

export const selectMonthlyEarnings = createSelector(
  [selectEarningsStats],
  (earnings) => earnings.monthlyData
);

export const selectEarningsStatsLoading = createSelector(
  [selectEarningsStats],
  (earnings) => earnings.loading
);

export const selectEarningsStatsError = createSelector(
  [selectEarningsStats],
  (earnings) => earnings.error
);
