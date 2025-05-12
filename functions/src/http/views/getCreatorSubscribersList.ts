import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { firestore } from "../../services/firebaseAdmin";
import { verifyAndAuthorizeRequest } from "../../services/http";
import { logError } from "../../services/logging";
import { search } from "../../services/meilisearch";
import { SearchOptions } from "../../types/meliSearch";
import { Roles } from "../../types/roles";

const SEARCH_LIMIT = 10;

export const getCreatorSubscribersList = onRequest(
  corsOptions,
  async (req, res) => {
    if (req.method !== "GET") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const uid = await verifyAndAuthorizeRequest(req, [Roles.CREATOR]);

      // Extract data from query parameters
      const query = (req.query.query as string) || "";
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : 0;

      // Execute Meilisearch query
      const searchOptions: SearchOptions = {
        index: "users",
        query,
        offset,
        limit: SEARCH_LIMIT,
        filter: `subscribedTo = "${uid}"`,
      };
      const searchResp = await search(searchOptions);
      const searchResults = searchResp.hits;

      const userIds = searchResults.map((user) => user.id);

      // If no results found or userIds are empty, return early
      if (userIds.length === 0) {
        res.status(200).json({ learners: [], hasMore: false });
        return;
      }

      // Firestore query to get filtered learners
      const usersSubsRef = firestore
        .collection("learners")
        .where("subscriberId", "in", userIds)
        .where("creatorId", "==", uid)
        .where("status", "in", ["active", "trialing"])
        .orderBy("startDate", "desc");

      const querySnapshot = await usersSubsRef.get();

      const filteredSubscribers = querySnapshot.docs.map((doc) => doc.data());

      const hasMore =
        searchResults.length === SEARCH_LIMIT && filteredSubscribers.length > 0;

      res.status(200).json({ learners: filteredSubscribers, hasMore });
    } catch (error) {
      logError(error);
      // We never want the client searchbar to error out
      res.status(200).json({ learners: [], hasMore: false });
      return;
    }
  }
);
