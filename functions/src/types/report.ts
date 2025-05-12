import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export enum ReportType {
  REEL = "reel",
  USER = "user",
}

const BaseReportSchema = z.object({
  type: z.nativeEnum(ReportType),
  reportedBy: z.string(),
  reason: z.string().optional(),
});

export const ReelReportSchema = BaseReportSchema.extend({
  type: z.literal(ReportType.REEL),
  reelId: z.string(),
  creatorId: z.string(),
});

export const UserReportSchema = BaseReportSchema.extend({
  type: z.literal(ReportType.USER),
  userId: z.string(),
});

export const ReportRequestSchema = z.discriminatedUnion("type", [
  ReelReportSchema,
  UserReportSchema,
]);

export type ReelReport = z.infer<typeof ReelReportSchema>;
export type UserReport = z.infer<typeof UserReportSchema>;
export type ReportRequest = z.infer<typeof ReportRequestSchema>;

export type Report = ReportRequest & { createdAt: Timestamp };
