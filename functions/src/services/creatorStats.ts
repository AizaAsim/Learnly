import { AppError } from "../shared/classes/AppError";
import { ReelInteraction, ReelInteractions } from "../types/reelInteractions";
import { VideoState, VideoStates } from "../types/videoStatus";
import { firestore } from "./firebaseAdmin";
import { logError } from "./logging";
import { getReelViews, getThumbnailUrl } from "./mux";

export const getCreatorStats = async (creatorId: string) => {
  // Check if we have cached data
  const creatorDataCache = await firestore
    .collection("creator_data_cache")
    .doc(creatorId)
    .get();

  if (creatorDataCache.exists) {
    const data = creatorDataCache.data();
    if (data && data.expiresAt.toMillis() > Date.now()) {
      delete data.expiresAt;
      return {
        counts: {
          ...data.counts,
          // This always needs to be live
          active: await getVideoCount(creatorId, VideoStates.ACTIVE),
        },
      };
    }
  }

  try {
    // Grab all our video counts
    const [active, likes, views] = await Promise.all([
      getVideoCount(creatorId, VideoStates.ACTIVE),
      getReelInteractionCount(creatorId, ReelInteractions.LIKE),
      // getReelInteractionCount(creatorId, ReelInteractions.BOOKMARK),
      getTotalViewCount(creatorId),
    ]);

    const response = {
      counts: {
        active,
        likes,
        // bookmarks,
        views,
      },
    };

    // Cache the data for 5 minutes\
    await firestore
      .collection("creator_data_cache")
      .doc(creatorId)
      .set({
        ...response,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

    return response;
  } catch (error) {
    logError("Error getting creator stats", creatorId, error);
    return {
      counts: {
        active: 0,
        likes: 0,
        // bookmarks: 0,
        views: 0,
      },
    };
  }
};

export const getTotalViewCount = async (creatorId: string) => {
  // There is no way to get the total view count or views by creator,
  // so we have to get all the active reels and then get the view count for each
  try {
    const activeReels = await firestore
      .collection(`reels`)
      .where("creatorId", "==", creatorId)
      .where("type", "==", VideoStates.ACTIVE)
      .where("isBlocked", "==", false) // Filter out blocked/banned reels
      .get();
    const assetIds = activeReels.docs.map((doc) => doc.data().assetId);
    const viewPromises = assetIds.map((assetId) => getReelViews(assetId));
    const response = await Promise.all(viewPromises);
    const count = response.flatMap((count) => count).reduce((a, b) => a + b, 0);

    return count;
  } catch (error) {
    logError("Error getting total view count", creatorId, error);
    return 0;
  }
};

export const getVideoCount = async (
  creatorId: string,
  videoState: VideoState
): Promise<number> => {
  try {
    const snapshot = await firestore
      .collection("reels")
      .where("creatorId", "==", creatorId)
      .where("type", "==", videoState)
      .where("isBlocked", "==", false) // Filter out blocked/banned reels
      .count()
      .get();

    return snapshot.data().count;
  } catch (error) {
    logError("Error getting video count", creatorId, error);
    return 0;
  }
};

export const getReelInteractionCount = async (
  creatorId: string,
  interaction: ReelInteraction
) => {
  try {
    const snapshot = await firestore
      .collection(interaction)
      .where("creatorId", "==", creatorId)
      .where("deleted", "!=", true)
      .count()
      .get();

    return snapshot.data().count;
  } catch (error) {
    logError("Error getting interaction count", creatorId, error);
    return 0;
  }
};

export const getLatestVideoThumbnail = async (
  creatorId: string,
  videoState: VideoState
) => {
  try {
    const video = await getLatestVideo(creatorId, videoState);
    if (!video) {
      return "";
    }
    const { playbackIds } = video;
    return getThumbnailUrl(playbackIds[0].id, {
      time: video.thumbnailFrameSecond,
    });
  } catch (error) {
    logError("Error getting latest video thumbnail", creatorId, error);
    return "";
  }
};

export const getLatestVideo = async (
  creatorId: string,
  videoState: VideoState
) => {
  try {
    const latest = await firestore
      .collection("reels")
      .where("creatorId", "==", creatorId)
      .where("type", "==", videoState)
      .where("isBlocked", "==", false) // Filter out blocked/banned reels
      .orderBy("uploaded_at", "desc")
      .limit(1)
      .get();

    if (latest.empty) {
      return null;
    }

    const [video] = latest.docs;
    return video.data();
  } catch (error) {
    logError("Error getting latest video", creatorId, error);
    return null;
  }
};

export const getReelCreatorDetails = async (creatorId: string) => {
  try {
    const creator = await firestore.collection("users").doc(creatorId).get();
    const data = creator.data();
    if (!data) {
      throw new AppError("Educator not found", 404);
    }

    return {
      id: creator.id as string,
      displayName: data.displayName as string,
      avatar_url: data.avatar_url as string,
      username: data.username as string,
      isVerified: data.isVerified ?? false,
    };
  } catch (error) {
    logError("Error getting creator details", creatorId, error);
    return null;
  }
};
