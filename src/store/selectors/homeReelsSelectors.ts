import { createSelector } from "@reduxjs/toolkit";
import { withHomeReelsSlice } from "../reducers/homeReelsReducer";

const selectHomeReelsSlice = withHomeReelsSlice.selector((state) => state.homeReels);

export const selectHomeReels = createSelector(selectHomeReelsSlice, (state) => state.reels);

