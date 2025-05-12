import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { search } from "../../services/meilisearch";
import { SearchOptions } from "../../types/meliSearch";
import { getStripeDoc } from "../../services/stripe";
import { AppError } from "../../shared/classes/AppError";

const SEARCH_LIMIT = 10;

export const searchCreators = onRequest(corsOptions, async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const uid = req.headers.authorization?.split("Bearer ")[1];
    if (!uid) {
      throw new AppError("User is not authenticated", 401);
    }

    const term = req.query.term as string;
    const offset = parseInt(req.query.offset as string, 10) || 0;

    if (!term) {
      throw new AppError("Search term is required", 400);
    }

    const params: SearchOptions = {
      index: "creators",
      query: term,
      offset,
      limit: SEARCH_LIMIT,
    };

    const searchResult = await search(params);
    const searchedCreators = searchResult.hits as {
      id: string;
    }[];
    const hasMore = searchedCreators.length === SEARCH_LIMIT;

    // Filter out the creators that do not have payout and charge enabled on stripe
    const filteredCreators = await Promise.all(
      searchedCreators.map(async (creator) => {
        const stripeDoc = await getStripeDoc(creator.id);
        if (stripeDoc?.charges_enabled && stripeDoc?.payouts_enabled) {
          return creator;
        }
        return null;
      })
    );

    // Remove null values and return the filtered array
    const validCreators = filteredCreators.filter(
      (creator): creator is { id: string } => creator !== null
    );

    res.setHeader("Cache-Control", "public, max-age=180, s-maxage=300");
    res.status(200).json({ creators: validCreators, hasMore });
  } catch (error) {
    logError(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to search creator" });
    }
  }
});
