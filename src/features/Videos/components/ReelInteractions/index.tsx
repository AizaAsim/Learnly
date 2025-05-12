import { useDeviceType } from "@/hooks/useDeviceType";
import { cn } from "@/lib/utils";
import { Interaction } from "./Interaction";
import { useCurrentReel } from "../../hooks/useCurrentReel";
import { useVideoInteractions } from "../../hooks/useVideoInteractions";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useReward } from "react-rewards";
import { TooltipWrapper } from "@/components/wrapper/TooltipWrapper";

export const ReelInteractions = ({
  className,
  locked,
}: {
  className?: string;
  locked?: boolean;
}) => {
  const { isMobile } = useDeviceType();
  const { reel } = useCurrentReel();
  const {
    isLiked,
    isBookmarked,
    handleLike,
    handleBookmark,
    likeCount,
    bookmarkCount,
  } = useVideoInteractions(reel!);
  const { user } = useAuth();
  const { t } = useTranslation();

  const isMine = useMemo(
    () => user?.uid === reel?.creatorId,
    [reel?.creatorId, user?.uid]
  );

  const likeTooltipText = useMemo(() => {
    if (isMine) {
      return t("videoPlayer_tooltip_like_mine");
    }
    return isLiked
      ? t("videoPlayer_tooltip_unlike")
      : t("videoPlayer_tooltip_like");
  }, [isLiked, isMine, t]);

  const bookmarkTooltipText = useMemo(() => {
    if (isMine) {
      return t("videoPlayer_tooltip_bookmark_mine");
    }
    return isBookmarked
      ? t("videoPlayer_tooltip_unbookmark")
      : t("videoPlayer_tooltip_bookmark");
  }, [isBookmarked, isMine, t]);

  const { reward: heartConfetti, isAnimating: isHeartAnimating } = useReward(
    "heart-confetti",
    "emoji",
    {
      lifetime: 125,
      zIndex: 60,
      elementSize: 12,
      elementCount: 25,
      emoji: ["❤️"],
    }
  );

  const likeHandler = () => {
    if (!isLiked) {
      heartConfetti();
    }
    handleLike();
  };

  return (
    <div
      className={cn(
        "flex",
        {
          "flex-col gap-3": isMobile,
          "flex-row px-5 gap-5": !isMobile,
        },
        className
      )}
    >
      <TooltipWrapper shouldWrap={isMobile} text={likeTooltipText}>
        <Interaction
          interactionId="heart-confetti"
          className="relative"
          icon="/icon/heart.svg"
          count={likeCount}
          filled={isLiked}
          onClick={likeHandler}
          disabled={isMine || isHeartAnimating || locked}
          fill="#EB323B"
        />
      </TooltipWrapper>
      <TooltipWrapper shouldWrap={isMobile} text={bookmarkTooltipText}>
        <Interaction
          interactionId="bookmark-confetti"
          icon="/icon/bookmark.svg"
          count={bookmarkCount}
          filled={isBookmarked}
          onClick={handleBookmark}
          disabled={isMine || locked}
          fill={isMobile ? "#FFFFFFE6" : "#000000CC"}
        />
      </TooltipWrapper>
      <TooltipWrapper
        shouldWrap={isMobile}
        text={t("videoPlayer_tooltip_views")}
      >
        <Interaction icon="/icon/play-small.svg" count={reel?.views || 0} />
      </TooltipWrapper>
    </div>
  );
};
