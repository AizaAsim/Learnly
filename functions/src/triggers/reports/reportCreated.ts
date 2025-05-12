import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logError, logInfo, logWarning } from "../../services/logging";
import { ReelReport, Report, ReportType, UserReport } from "../../types/report";
import {
  getReelReportCount,
  isWhiteListed,
  getUserWhitelistRecord,
  submitReportForModeration,
} from "../../services/report";
import { getLastPublishedReel } from "../../services/creatorVideos";
import { firestore } from "../../services/firebaseAdmin";
import { moderateReelByAI } from "../../services/moderation";
import { joinStringsWithCommaAndAnd } from "../../shared/helpers/utils";

export const reportCreated = onDocumentCreated(
  "reports/{reportId}",
  async (event) => {
    const snapshot = event.data;
    const reportId = event.params.reportId;
    if (!snapshot) {
      logWarning("No data associated with the event", event);
      return;
    }
    const reportData = snapshot.data() as Report;
    if (!reportData) {
      logWarning("No data associated with the snapshot", event, snapshot);
      return;
    }

    try {
      switch (reportData.type) {
        case ReportType.REEL:
          await handleReelReport(reportId, reportData);
          break;
        case ReportType.USER:
          await handleUserReport(reportId, reportData);
          break;
        default:
          logWarning("Unknown report type", event, reportData);
      }
    } catch (error) {
      const message = `Error in report created trigger: ${error}`;
      logError(message, event, error);
    }
  }
);

async function handleReelReport(
  reportId: string,
  reportData: ReelReport
): Promise<void> {
  // Check if reel is whitelisted
  const whitelisted = await isWhiteListed(reportData.reelId, ReportType.REEL);
  if (whitelisted) {
    logInfo("Reported EduClip is whitelisted, ignoring report", {
      reelId: reportData.reelId,
    });
    return;
  }

  // Submit report to moderation app
  await submitReportForModeration(reportId, reportData as Report);

  // Check report threshold
  const reportThreshold = parseInt(process.env.REPORT_THRESHOLD || "", 10);
  const reportCount = await getReelReportCount(reportData.reelId);
  if (reportCount < reportThreshold) return;

  const reelId = reportData.reelId;
  const moderation = await moderateReelByAI(reelId);
  // If any frame is flagged, mark the reel as banned
  if (moderation.isFlagged) {
    const flaggedCategories = joinStringsWithCommaAndAnd(
      moderation.flaggedCategories
    );
    // mark the reel as banned
    await firestore
      .collection("reels")
      .doc(reelId)
      .update({ isBlocked: true, blockedReason: flaggedCategories });
    return;
  }
}

async function handleUserReport(
  reportId: string,
  reportData: UserReport
): Promise<void> {
  // Check if user is whitelisted
  const whitelisted = await isWhiteListed(reportData.userId, ReportType.USER);
  if (!whitelisted) {
    // If not whitelisted, process normally
    await submitReportForModeration(reportId, reportData as Report);
    return;
  }

  //TODO: Check it after "add to whitelist" functionality is added in admin dashboard based on whitelist doc structure
  // Get user's whitelist timestamp and last upload time
  const whitelistData = await getUserWhitelistRecord(reportData.userId);

  if (!whitelistData) {
    logWarning("Whitelisted user has no whitelist record", {
      userId: reportData.userId,
    });
    return;
  }
  const { whitelistedAt } = whitelistData;
  const lastPublishedReel = await getLastPublishedReel(reportData.userId);
  const lastUploadAt = lastPublishedReel?.publishedAt;
  // If user has uploaded content after being whitelisted, process the report
  if (lastUploadAt && whitelistedAt && lastUploadAt > whitelistedAt) {
    await submitReportForModeration(reportId, reportData as Report);
  } else {
    logInfo("Ignoring report for whitelisted user with no new uploads", {
      userId: reportData.userId,
      whitelistedAt,
      lastUploadAt,
    });
  }
}
