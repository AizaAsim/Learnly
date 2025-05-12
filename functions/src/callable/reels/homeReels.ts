import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getHomeReels } from "../../services/homeReels";
import { ReelData } from "../../types/reels";
import { getAdditionalReelData } from "../../services/creatorVideos";

export const homeReels = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }
  try {
    const reels = await getHomeReels(uid);
    const reelsPromises = reels.map((reel) =>
      getAdditionalReelData(reel as ReelData)
    );
    const reelsWithAdditionalData = await Promise.all(reelsPromises);
    return { reels: reelsWithAdditionalData };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to fetch reels.");
  }
});
