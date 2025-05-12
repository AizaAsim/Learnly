import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { firestore } from "../../services/firebaseAdmin";
import { logError } from "../../services/logging";
import { getUserRole } from "../../services/users";
import { Roles } from "../../types/roles";

export const getUserSubscriptionsList = onCall(corsOptions, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "User is not authenticated");
  }
  const role = await getUserRole(uid);
  if (role !== Roles.USER) {
    throw new HttpsError("permission-denied", "Only user role is allowed");
  }

  try {
    const query = firestore
      .collection("users_subscriptions")
      .where("subscriberUid", "==", uid);
    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      return { creatorsData: [] };
    }

    const creatorIds = querySnapshot.docs.map((doc) => doc.data().creatorUid);

    const creatorsDataPromises = creatorIds.map(async (creatorId) => {
      const creatorDoc = await firestore
        .collection("users")
        .doc(creatorId)
        .get();
      const creatorData = creatorDoc.data();

      if (creatorData) {
        return {
          id: creatorId,
          displayName: creatorData.displayName,
          username: creatorData.username,
          avatarUrl: creatorData.avatar_url,
          profileSlug: `/${creatorData.username}`,
          isVerified: Math.random() >= 0.5, // Randomly return true or false for now
        };
      }

      return null;
    });

    const creatorsData = (await Promise.all(creatorsDataPromises)).filter(
      Boolean
    );

    return { creatorsData };
  } catch (error) {
    logError(error);
    throw new HttpsError("internal", "Failed to get user subscriptions");
  }
});
