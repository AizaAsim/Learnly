import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError, logInfo } from "../../services/logging";
import { deleteAsset } from "../../services/mux";
import { deleteReelDoc, getReelDoc } from "../../services/videos";
import { AppError } from "../../shared/classes/AppError";
import { VideoStates } from "../../types/videoStatus";

interface RequestBody {
  postId: string;
}

export const cleanUpExpiredTempPosts = onRequest(
  { ...corsOptions, ingressSettings: "ALLOW_INTERNAL_ONLY" },
  async (request, response) => {
    const { postId } = request.body as RequestBody;
    if (!postId) {
      response.status(400).send("Invalid request body");
      return;
    }
    logInfo(`Cleaning up expired temp post ${postId}`);
    try {
      //check if the temp post exists
      const tempPost = await getReelDoc(postId);
      if (!tempPost) {
        throw new AppError("Post not found", 404);
      }
      if (tempPost.type !== VideoStates.TEMP) {
        throw new AppError("Post is not a temp post", 400);
      }
      //delete the asset from mux
      await deleteAsset(tempPost.assetId);
      //remove the temp post info from firestore
      await deleteReelDoc(postId);
      response.status(200).send(`Cleaned up expired temp post ${postId}`);
    } catch (error) {
      logError("Error cleaning up expired temp post:", error);
      if (error instanceof AppError)
        response.status(error.statusCode).send(error.message);
      else response.status(500).send("Error cleaning up expired temp post");
    }
  }
);
