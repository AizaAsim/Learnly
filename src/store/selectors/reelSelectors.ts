import { createSelector } from "@reduxjs/toolkit";
import { selectCreatorVideos } from "./creatorProfileSelectors";
import { selectHomeReels } from "./homeReelsSelectors";
import { RootState } from "..";
import { selectReels as selectMyVideosReels } from "./myVideoSelectors";
import { selectVideo } from "./reelUploadSelectors";
import { AppUser } from "@/features/Auth/types";
import { ReelData } from "@/types";
import { selectSavedReels } from "./savedReelsSelectors";

// Selector for getting a reel by ID based on the current route
export const selectCurrentReel = createSelector(
  [
    selectMyVideosReels,
    selectHomeReels,
    selectCreatorVideos,
    selectVideo,
    selectSavedReels,
    (_: RootState, path: string) => path,
    (_: RootState, __: string, id: string) => id,
    (_: RootState, __: string, ___: string, user: AppUser | null | undefined) =>
      user,
  ],
  (
    myVideosReels,
    homeReels,
    creatorVideos,
    video,
    savedReels,
    path,
    id,
    user
  ) => {
    if (path.startsWith("/my-profile")) {
      return myVideosReels.find((r) => r.id === id);
    }
    if (path.startsWith("/home")) {
      return homeReels.find((r) => r.id === id);
    }
    if (path.startsWith("/preview") || path.startsWith("/removed")) {
      return {
        ...video,
        creator: {
          username: user?.username,
          id: user?.uid,
          displayName: user?.displayName,
          avatar_url: user?.avatar_url,
          isVerified: false, // TODO
        },
      } as ReelData;
    }
    if (path.startsWith("/saved")) {
      return savedReels.find((r) => r.id === id);
    }
    return creatorVideos.find((r) => r.id === id);
  }
);
