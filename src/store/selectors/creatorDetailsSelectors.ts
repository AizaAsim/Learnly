import { createSelector } from "@reduxjs/toolkit";
import { withCreatorDetailsSlice } from "../reducers/creatorDetailsReducer";

const selectCreatorDetailsState = withCreatorDetailsSlice.selector((state) => state.creatorDetails);

export const selectCreatorDetails = createSelector(
  selectCreatorDetailsState,
  (state) => state.creators
);

export const selectCreatorDetailsLoading = createSelector(
  selectCreatorDetailsState,
  (state) => state.status === "loading"
);

export const selectCreatorDetailsError = createSelector(
  selectCreatorDetailsState,
  (state) => state.error
);

export const selectReelCreatorById = (id: string) =>
  createSelector([selectCreatorDetails], (items) =>
    items.find((item) => item.id === id)
  );