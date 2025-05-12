import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { AppError } from "../../shared/classes/AppError";
import { getReelCreatorDetails as getDetails } from "../../services/creatorStats";

export const getReelCreatorDetails = onRequest(
  corsOptions,
  async (req, res) => {
    if (req.method !== "GET") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const creatorId = req.query.creatorId as string;
      if (!creatorId) {
        throw new AppError("Educator ID is required", 400);
      }

      const creator = await getDetails(creatorId);

      res.setHeader("Cache-Control", "public, max-age=180, s-maxage=300");
      res.status(200).json({ ...creator });
    } catch (error) {
      logError(error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to get creator detail." });
      }
    }
  }
);
