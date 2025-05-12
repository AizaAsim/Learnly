import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { getCreatorStats } from "../../services/creatorStats";
import { logError } from "../../services/logging";
import { getUserByUsername } from "../../services/users";
import { AppError } from "../../shared/classes/AppError";

export const getCreatorProfileData = onRequest(
  corsOptions,
  async (req, res) => {
    if (req.method !== "GET") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const creatorUsername = req.query.creatorUsername as string;
      if (!creatorUsername) {
        throw new AppError("Educator username is required", 400);
      }

      const creatorData = await getUserByUsername(creatorUsername);
      if (!creatorData) {
        throw new AppError("Educator not found", 404);
      }

      const creatorId = creatorData.id;
      const creatorStats = await getCreatorStats(creatorId);

      res.setHeader("Cache-Control", "public, max-age=90, s-maxage=180");
      res.status(200).json({
        ...creatorData,
        ...creatorStats,
      });
    } catch (error) {
      logError(error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to get profile data" });
      }
    }
  }
);
