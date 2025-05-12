import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import {
  checkDuplicateReport,
  submitReport as createReport,
} from "../../services/report";
import { ReportRequestSchema } from "../../types/report";

export const submit = onCall(corsOptions, async (request) => {
  try {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "User is not authenticated");
    }
    const report = {
      ...request.data,
      reportedBy: uid,
    };
    const parsedRequest = ReportRequestSchema.parse(report);

    const isDuplicate = await checkDuplicateReport(parsedRequest);
    if (isDuplicate) {
      throw new HttpsError(
        "already-exists",
        `You have already reported this ${parsedRequest.type}.`
      );
    }

    await createReport(parsedRequest);
    return { success: true };
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to submit report.");
  }
});
