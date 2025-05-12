import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { getCreatorVideoData } from "../../services/creatorVideos";
import { checkUserSubscribeToCreator } from "../../services/subscription";
import { getUserByUsername } from "../../services/users";

export const getCreatorVideos = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    const creatorUsername = request.data.creatorUsername;
    if (!creatorUsername) {
      throw new HttpsError("invalid-argument", "Educator username is required");
    }
    const creator = await getUserByUsername(creatorUsername);
    if (!creator) {
      throw new HttpsError("not-found", "Educator not found");
    }

    // check if user is subscribed to creator
    let isSubscribed = false;
    let isPastDue = false;
    if (uid) {
      const check = await checkUserSubscribeToCreator(creator.id, uid);
      isSubscribed = check.isSubscribed;
      isPastDue = check.isPastDue;
    }
    let creatorVideos = await getCreatorVideoData(creator.id);

    // remove the playback ids from the videos if the user is not subscribed or subscription become past due
    const removePlaybackIds = !isSubscribed || isPastDue;
    if (removePlaybackIds) {
      creatorVideos = creatorVideos.map((video) => {
        return {
          ...video,
          playbackIds: [],
        };
      });
    }

    return {
      creatorVideos,
      isSubscribed,
      isPastDue,
      creatorId: creator.id,
    };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to handle video state");
  }
});
