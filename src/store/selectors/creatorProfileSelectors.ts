import { withCreatorProfileSlice } from "../reducers/creatorProfileReducer";
import { createSelector } from "@reduxjs/toolkit";

const selectCreatorProfile = withCreatorProfileSlice.selector((state) => state.creatorProfile);

export const selectCreatorProfileData = createSelector(selectCreatorProfile, (state) => state.profileData);
export const selectCancelAtPeriodEnd = createSelector(selectCreatorProfile, (state) => state.profileData?.cancelAtPeriodEnd);
export const selectCreatorProfileLoading = createSelector(selectCreatorProfile, (state) => state.profileLoading);
export const selectCreatorVideos = createSelector(selectCreatorProfile, (state) => state.creatorVideos);
export const selectIsSubscribed = createSelector(selectCreatorProfile, (state) => state.isSubscribed);
export const selectIsPastDue = createSelector(selectCreatorProfile, (state) => state.isPastDue);
export const selectCreatorAccountDeleted = createSelector(selectCreatorProfile, (state) => state.isCreatorAccountDeleted);
export const selectCreatorId = createSelector(selectCreatorProfile, (state) => state.creatorId);
export const selectVideosLoading = createSelector(selectCreatorProfile, (state) => state.videosLoading);
export const selectCreatorUsername = createSelector(selectCreatorProfile, (state) => state.username);
export const selectCreatorEmail = createSelector(selectCreatorProfile, (state) => state.email);