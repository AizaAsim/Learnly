import { createSelector } from "@reduxjs/toolkit";
import { withBlockedReelSlice } from "../reducers/blockedReelReducer";

const selectBlockedReelsSlice = withBlockedReelSlice.selector((state) => state.blockedReels);

export const selectBlockedReelId = createSelector([selectBlockedReelsSlice], (state) => state.reelId);
export const selectBlockedReel = createSelector([selectBlockedReelsSlice], (state) => state.reel);
export const selectBlockedReelStatus = createSelector([selectBlockedReelsSlice], (state) => state.status);
export const selectBlockedReelError = createSelector([selectBlockedReelsSlice], (state) => state.error);
export const selectBlockedReels = createSelector([selectBlockedReel], (reel) => reel ? [reel] : []);