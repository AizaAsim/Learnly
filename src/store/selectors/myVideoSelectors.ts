import { createSelector } from "@reduxjs/toolkit";
import { withMyVideoSlice } from "../reducers/myVideosReducer";

const selectVideoSlice = withMyVideoSlice.selector((state) => state.myVideos);

export const selectReels = createSelector(
  selectVideoSlice,
  (state) => state.reels
);

export const selectLastUpdated = createSelector(
  selectVideoSlice,
  (state) => state.lastUpdated
);

export const selectDrafts = createSelector([selectReels], (videos) =>
  videos.filter((video) => video.type === "draft")
);

export const selectScheduled = createSelector([selectReels], (videos) =>
  videos.filter((video) => video.type === "scheduled")
);

export const selectActive = createSelector([selectReels], (videos) =>
  videos.filter((video) => video.type === "active")
);

export const selectArchived = createSelector([selectReels], (videos) =>
  videos.filter((video) => video.type === "archived")
);

// Sorted by most recently uploaded
export const selectSortedDrafts = createSelector([selectDrafts], (items) => {
  return items.sort((a, b) => b.uploaded_at - a.uploaded_at);
});

// Sorted by soonest to be published
export const selectSortedScheduled = createSelector(
  [selectScheduled],
  (items) => {
    return items.sort(
      (a, b) => (a.scheduledAt?._seconds || 0) - (b.scheduledAt?._seconds || 0)
    );
  }
);

// Sorted by most recently published
export const selectSortedActive = createSelector([selectActive], (items) => {
  return items.sort(
    (a, b) => (b.publishedAt?._seconds || 0) - (a.publishedAt?._seconds || 0)
  );
});

// Sorted by most recently archived
export const selectSortedArchived = createSelector(
  [selectArchived],
  (items) => {
    return items.sort(
      (a, b) => (b.archivedAt?._seconds || 0) - (a.archivedAt?._seconds || 0)
    );
  }
);

export const selectReelById = (id: string) =>
  createSelector([selectReels], (items) =>
    items.find((item) => item.id === id)
  );
