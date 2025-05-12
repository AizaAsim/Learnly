import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { getUserByEmail } from "../../services/users";
import { updateLastActive } from "../../services/activity";

export const updateLastActivity = onCall(corsOptions, async (request) => {
  const { primaryEmail } = request.data;

  if (!primaryEmail) {
    throw new HttpsError("invalid-argument", "Email are required");
  }

  try {
    const user = await getUserByEmail(primaryEmail);
    if (!user) {
      throw new HttpsError("not-found", "User not found");
    }
    const uid = user.id;

    await updateLastActive(uid);
  } catch (e) {
    console.error(e);
    throw new HttpsError("internal", "Error updating last activity");
  }
});
