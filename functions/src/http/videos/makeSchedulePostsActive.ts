import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError, logInfo } from "../../services/logging";
import { makeReelActive } from "../../services/videos";
import { AppError } from "../../shared/classes/AppError";

interface RequestBody {
  postId: string;
  userId: string;
}

export const makeSchedulePostsActive = onRequest(
  { ...corsOptions, ingressSettings: "ALLOW_INTERNAL_ONLY" },
  async (request, response) => {
    const { postId, userId } = request.body as RequestBody;
    if (!postId) {
      response.status(400).send("Invalid request body");
      return;
    }
    logInfo(`Publishing scheduled post ${postId}`);
    try {
      await makeReelActive(postId, userId);
      response.status(200).send(`Published post ${postId}`);
    } catch (error) {
      logError("Error publishing scheduled post:", error);
      if (error instanceof AppError)
        response.status(error.statusCode).send(error.message);
      else response.status(500).send("Error publishing scheduled post");
    }
  }
);
