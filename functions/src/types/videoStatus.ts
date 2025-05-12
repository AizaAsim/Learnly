export enum VideoStates {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  ACTIVE = "active",
  TEMP = "temp",
  ARCHIVED = "archived",
  CANCELLED = "cancelled",
  DELETED = "deleted",
}

export type VideoState = VideoStates;
