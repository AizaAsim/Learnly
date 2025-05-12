import { ReportRequest, ReportType } from "../types/report";
import { firestore } from "./firebaseAdmin";
import { Report } from "../types/report";
import { sendToModerationApp } from "./moderation";

export const submitReport = async (report: ReportRequest) => {
  await firestore.collection("reports").add({
    ...report,
    createdAt: new Date(),
  });
};

export const checkDuplicateReport = async (report: ReportRequest) => {
  let query = firestore
    .collection("reports")
    .where("reportedBy", "==", report.reportedBy)
    .where("type", "==", report.type);

  if (report.type === "reel") {
    query = query.where("reelId", "==", report.reelId);
  } else if (report.type === "user") {
    query = query.where("userId", "==", report.userId);
  }

  const snapshot = await query.get();

  return !snapshot.empty; // Returns true if duplicate exists
};

const hasRecord = async (collection: string, id: string, type: ReportType) => {
  const query = firestore.collection(collection);
  if (type === "reel") {
    query.where("reelId", "==", id);
  } else if (type === "user") {
    query.where("userId", "==", id);
  }
  const snapshot = await query.get();
  return !snapshot.empty;
};

export const isWhiteListed = async (id: string, type: ReportType) => {
  return hasRecord("whitelist", id, type);
};

export const isBlackListed = async (id: string, type: ReportType) => {
  return hasRecord("blacklist", id, type);
};

export const getReelReportCount = async (reelId: string) => {
  const query = firestore.collection("reports").where("reelId", "==", reelId);
  const snapshot = await query.get();
  return snapshot.size;
};

export const getUserReportCount = async (userId: string) => {
  const query = firestore.collection("reports").where("userId", "==", userId);
  const snapshot = await query.get();
  return snapshot.size;
};

export const submitReportForModeration = async (
  reportId: string,
  report: Report
) => {
  const payload = {
    ...report,
    id: reportId,
    createdAt: report.createdAt.toDate().toISOString(),
  };

  return await sendToModerationApp("reports", payload);
};

export const getUserWhitelistRecord = async (userId: string) => {
  const whitelistDoc = await firestore
    .collection("whitelist")
    .where("userId", "==", userId)
    .get();
  if (whitelistDoc.empty) return null;
  return whitelistDoc.docs[0].data();
};
