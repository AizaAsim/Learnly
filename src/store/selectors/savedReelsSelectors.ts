import { createSelector } from "@reduxjs/toolkit";
import { withSavedReelsSlice } from "../reducers/savedReelsReducer";

const selectSavedReelsState = withSavedReelsSlice.selector(
  (state) => state.savedReels
);

export const selectSavedReels = createSelector(selectSavedReelsState, (state) =>
  state.reels
);

export const selectSavedReelsStatus = createSelector(selectSavedReelsState, (state) =>
  state.status
);

export const selectSavedReelsError = createSelector(selectSavedReelsState, (state) =>
  state.error
);

export const selectSavedReelsHasMore = createSelector(selectSavedReelsState, (state) =>
  state.hasMore
);

export const selectSubscribedSavedReels = createSelector(
  selectSavedReels,
  (reels) => reels.filter((reel) => reel.isSubscribed)
);