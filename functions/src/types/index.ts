import { Timestamp } from "firebase-admin/firestore";

export enum NotificationType {
  IN_APP_NOTIFICATION = "IN_APP_NOTIFICATION",
  EMAIL = "EMAIL",
  BOTH = "BOTH",
}

export interface BaseNotification {
  id: string;
  title: string;
  message?: string;
  icon?: string;
  data?: Record<string, unknown>;
  isVerified?: boolean;
}

export interface Notification extends BaseNotification {
  sentAt: Timestamp;
  readAt?: Timestamp;
}

export interface NotificationPayload extends Notification {
  userId: string;
}

export interface SerializedNotificationPayload extends BaseNotification {
  userId: string;

  // Optional properties
  sentAt: NormalizedTimestamp;
  readAt?: NormalizedTimestamp;
}

export interface Interaction {
  userId: string;
  videoId: string;
  creatorId: string;
  deleted: boolean;
  target: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NormalizedTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface ServiceHealth {
  status: "UP" | "DOWN";
  name: string;
  error?: string;
}

// operational, degraded_performance, partial_outage, or major_outage
export type OperationStatus =
  | "operational"
  | "degraded_performance"
  | "partial_outage"
  | "major_outage";

export interface StatusComponent {
  id: string;
  name: string;
  status: OperationStatus;
  created_at: string;
  updated_at: string;
  position: number;
  description: string | null;
  showcase: boolean;
  start_date: string | null;
  group_id: string | null;
  page_id: string;
  group: boolean;
  only_show_if_degraded: boolean;
  components?: string[];
}

export interface StatusPage {
  id: string;
  name: string;
  url: string;
  time_zone: string;
  updated_at: string;
}

export interface StatusAPIResponse {
  page: StatusPage;
  components: StatusComponent[];
}

export interface CreatorAppeal {
  reelId: string;
  creatorId: string;
  comment?: string;
  appealedAt: Timestamp;
}
