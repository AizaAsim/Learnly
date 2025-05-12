import { VideoStates } from "../types/videoStatus";
import { getReelsByState } from "./creatorVideos";
import { getUsersActiveSubscriptions } from "./subscription";
import { logInfo } from "./logging";

export async function getHomeReels(uid: string) {
  // Get all the creator ids that the user is subscribed to
  const activeSubs = await getUsersActiveSubscriptions(uid);
  const creatorIds = activeSubs.map((sub) => sub.creatorUid);

  // Nome grab all the public reels of the creators
  const reelPromises = creatorIds.map((creatorId) =>
    getReelsByState(creatorId, VideoStates.ACTIVE)
  );
  const reels = await Promise.all(reelPromises);

  // Flatten the arrays, sorted by date so the newest plays first
  return reels.flat().sort((a, b) => {
    if (!a.publishedAt || !b.publishedAt) {
      logInfo("EduClip has no publishedAt in homeReels.ts", { a, b });
      return 1;
    }
    const aDate = a.publishedAt.toMillis();
    const bDate = b.publishedAt.toMillis();
    return bDate - aDate;
  });
}
