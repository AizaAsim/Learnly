import { Interaction } from "../types";
import { getAdditionalReelData } from "./creatorVideos";
import { firestore } from "./firebaseAdmin";
import { logError } from "./logging";
import { getUsersActiveSubscriptions } from "./subscription";
import { getReelDoc } from "./videos";

interface GetSavedReelsParams {
  uid: string;
  lastDocId?: string;
}

const SAVED_REELS_LIMIT = 10;

export async function getSavedReels({ uid, lastDocId }: GetSavedReelsParams) {
  // Fetch subscriptions and build initial query
  const activeSubs = await getUsersActiveSubscriptions(uid);
  let query = firestore
    .collection("bookmarks")
    .where("userId", "==", uid)
    .where("deleted", "==", false)
    .orderBy("createdAt", "desc")
    .limit(SAVED_REELS_LIMIT);

  // Add pagination if lastDocId exists
  if (lastDocId) {
    const lastDoc = await firestore
      .collection("bookmarks")
      .doc(lastDocId)
      .get();
    query = query.startAfter(lastDoc);
  }

  // Execute query
  const bookmarksSnapshot = await query.get();

  // Create a Set of subscribed creator IDs
  const subscribedCreatorIds = new Set(activeSubs.map((sub) => sub.creatorUid));

  // Process bookmarks
  const bookmarks = bookmarksSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Interaction & { id: string }
  );

  // Batch process reels with their additional data
  const reelsWithData = await Promise.all(
    bookmarks.map(async (bookmark) => {
      // use try/catch to move to the next reel if one not found
      let reel = null;
      try {
        reel = await getReelDoc(bookmark.videoId);
      } catch (error) {
        logError(error);
        return null;
      }

      // Filter out banned/blocked reel
      if (reel.isBlocked) return null;

      const reelWithAdditionalData = await getAdditionalReelData(reel);

      const isSubscribed = subscribedCreatorIds.has(
        reelWithAdditionalData.creatorId
      );

      return {
        ...reelWithAdditionalData,
        isSubscribed,
        playbackIds: isSubscribed ? reelWithAdditionalData.playbackIds : [],
        bookmarkId: bookmark.id,
      };
    })
  );
  // Filter out null values (blocked reels)
  const filteredReels = reelsWithData.filter((reel) => reel !== null);

  return {
    reels: filteredReels,
    hasMore: bookmarksSnapshot.docs.length === SAVED_REELS_LIMIT,
    lastDocId: bookmarksSnapshot.docs[bookmarksSnapshot.docs.length - 1]?.id,
  };
}
