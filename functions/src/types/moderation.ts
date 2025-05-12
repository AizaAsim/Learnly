import { Moderation } from "openai/resources";

type ModerationWithoutCategoryAppliedInputTypes = Omit<
  Moderation,
  "category_applied_input_types"
>;

export interface FrameModerationResult
  extends ModerationWithoutCategoryAppliedInputTypes {
  frameTime: number;
}

export interface AIModeration {
  reelId: string;
  creatorId: string;
  isFlagged: boolean; // Accumulated result of all frames, link and description
  frames: FrameModerationResult[];
  description: ModerationWithoutCategoryAppliedInputTypes | null;
  link: ModerationWithoutCategoryAppliedInputTypes | null;
  flaggedCategories: string[];
}
