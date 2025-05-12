import { ReelData } from "../types/reels";
import { VideoState, VideoStates } from "../types/videoStatus";
import { getReelCreatorDetails } from "./creatorStats";
import { firestore } from "./firebaseAdmin";
import { getReelViews, getThumbnailUrl } from "./mux";

export const getMyVideoData = async (uid: string) => {
  const myReels = await firestore
    .collection("reels")
    .where("creatorId", "==", uid)
    .where("status", "==", "ready")
    .where("type", "not-in", [VideoStates.TEMP, VideoStates.DELETED]) // Filter out temp & deleted reels
    .where("isBlocked", "==", false) // Filter out blocked/banned reels
    .get();

  const myReelDataPromises = [];

  for (const doc of myReels.docs) {
    const reel = doc.data() as ReelData;
    if (reel.type === VideoStates.TEMP || reel.status !== "ready") continue;
    const promise = getAdditionalReelData(reel);
    myReelDataPromises.push(promise);
  }

  const reels = await Promise.all(myReelDataPromises);

  return { reels };
};

export const getCreatorVideoData = async (
  creatorId: string
): Promise<ReelData[]> => {
  const activeReels = await getReelsByState(creatorId, VideoStates.ACTIVE);
  const reelsWithAdditionalData = activeReels.map((reel) =>
    getAdditionalReelData(reel as ReelData)
  );
  return Promise.all(reelsWithAdditionalData);
};

export const getReelsByState = async (creatorId: string, state: VideoState) => {
  const snapshot = await firestore
    .collection("reels")
    .where("creatorId", "==", creatorId)
    .where("type", "==", state)
    .where("isBlocked", "==", false) // Filter out blocked/banned reels
    .orderBy("uploaded_at", "desc")
    .get();

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        state,
      }) as ReelData
  );
};

// Maps a reel to include its creator, thumbnail, and like / bookmark / view count
export const getAdditionalReelData = async (reel: ReelData) => {

  // check if the additional data is cached
  const additionalDataCache = await firestore
    .collection("additional_reel_data_cache")
    .doc(reel.id)
    .get();

  if (additionalDataCache.exists) {
    const data = additionalDataCache.data();
    if (data && data.expiresAt.toMillis() > Date.now()) {
      delete data.expiresAt;
      return {
        ...reel,
        ...data,
      };
    }
  }

  const thumbnailPromise = getThumbnailUrl(reel.playbackIds[0].id, {
    time: reel.thumbnailFrameSecond,
  });

  const likesPromise = firestore
    .collection("likes")
    .where("videoId", "==", reel.id)
    .where("deleted", "!=", true)
    .get();

  // const bookmarksPromise = firestore
  //   .collection("bookmarks")
  //   .where("videoId", "==", reel.id)
  //   .where("deleted", "!=", true)
  //   .get();

  const creatorPromise = getReelCreatorDetails(reel.creatorId);

  const [
    thumbnail,
    likesSnapshot,
    // bookmarksSnapshot,
    creator,
    views,
  ] = await Promise.all([
    thumbnailPromise,
    likesPromise,
    // bookmarksPromise,
    creatorPromise,
    getReelViews(reel.assetId),
  ]);

  const likes = likesSnapshot?.docs?.length;
  // const bookmarks = bookmarksSnapshot?.docs?.length;
  const additionalData = {
    id: reel.id,
    thumbnail,
    likes,
    // bookmarks,
    creator: creator || undefined,
    views,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Cache for 5 minutes
  };

  // Cache the additional data
  await firestore
    .collection("additional_reel_data_cache")
    .doc(reel.id)
    .set(additionalData);

  return {
    ...reel,
    ...additionalData
  };
};

export const getLastPublishedReel = async (creatorId: string) => {
  const query = firestore
    .collection("reels")
    .where("creatorId", "==", creatorId)
    .where("status", "==", VideoStates.ACTIVE)
    .orderBy("publishedAt", "desc")
    .limit(1);
  const snapshot = await query.get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as ReelData;
};
