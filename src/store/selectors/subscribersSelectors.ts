import { createSelector } from "@reduxjs/toolkit";
import { withSubscriberFilterSlice } from "../reducers/subscribersReducer";

export const selectSubscribersState = withSubscriberFilterSlice.selector(
  (state) => state.learners
);

// Selectors for individual properties within the learners state slice
export const selectSubscribers = createSelector(
  [selectSubscribersState],
  (subscribersState) => subscribersState.learners
);

export const selectSubscribersStatus = createSelector(
  [selectSubscribersState],
  (subscribersState) => subscribersState.status
);

export const selectSubscribersError = createSelector(
  [selectSubscribersState],
  (subscribersState) => subscribersState.error
);

export const selectHasMoreSubscribers = createSelector(
  [selectSubscribersState],
  (subscribersState) => subscribersState.hasMore
);

export const selectNumberOfSubscribers = createSelector(
  [selectSubscribersState],
  (subscribersState) => subscribersState.numberOfSubscribers
);
