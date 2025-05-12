import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export enum ReportType {
  REEL = "reel",
  USER = "user",
}

interface BaseReport {
  reason?: string;
}

export interface ReelReport extends BaseReport {
  type: ReportType.REEL;
  reelId: string;
  creatorId: string;
}

export interface UserReport extends BaseReport {
  type: ReportType.USER;
  userId: string;
}

export type ReportRequest = ReelReport | UserReport;

export interface ReportResponse {
  success: boolean;
}

export const submitReport = httpsCallable<ReportRequest, ReportResponse>(
  functions,
  "report-submit"
);
