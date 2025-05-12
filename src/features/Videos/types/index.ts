import { RootState } from "@/store";
import { ReelData } from "@/types";
import { ReactNode } from "react";

export type VideoTokens = {
  playback: string;
  thumbnail: string;
  storyboard: string;
};

export type Policy = "signed" | "public";
export type Status =
  | "preparing"
  | "waiting"
  | "ready"
  | "errored"
  | "asset_created";

export type PlaybackId = {
  id: string;
  policy: Policy;
};

export type VideoInfo = {
  id: string;
  status: Status;
  title?: string;
  aspect?: string;
  playbackIds?: PlaybackId[];
  uploaded_at?: number;
  errorType?: "invalid_input";
  likesCount?: number;
  bookmarksCount?: number;
  type: "temp" | "active" | "archived" | "cancelled" | "scheduled" | "draft";
  fileHash?: string;
  thumbnailFrameSecond: number;
};

export type PreloadReelData = {
  id: string;
  selector: (state: RootState) => ReelData[];
  menu: ReactNode;
};

export interface Thumbnail {
  time: number;
  url: string;
}

export interface SlideControls {
  nextSlide: () => void;
  previousSlide: () => void;
}
