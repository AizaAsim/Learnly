import { cn, timestampToDate } from "@/lib/utils";
import { ReelData } from "@/types";
import { format } from "date-fns";
import { Trans, useTranslation } from "react-i18next";

interface PostCardProps {
  reelData: ReelData;
  className?: string;
  onClick?: () => void;
}

export const PostCard = ({ reelData, onClick, className }: PostCardProps) => {
  const { t } = useTranslation();

  const publishedAt =
    reelData?.publishedAt && timestampToDate(reelData?.publishedAt);

  return (
    <div
      className={cn(
        "mb-8 py-2 flex gap-2.5 cursor-pointer hover:bg-grayscale-4 rounded-[14px]",
        className
      )}
      onClick={onClick}
    >
      <img
        src={reelData?.thumbnail}
        className="w-10 h-[52px] rounded-lg mx-1.5 object-cover bg-gradient-to-tr from-grayscale-4 to-grayscale-12"
      />
      <div className="flex flex-col gap-1">
        <p className="text-[15px]/5 font-semibold -tracking-[0.225px]">
          {t("post_removed.details")}
        </p>
        {publishedAt && (
          <p className="text-grayscale-60 text-[13px]/4 font-medium -tracking-[0.195px]">
            <Trans
              i18nKey="post_removed.posted_at"
              values={{
                date: format(publishedAt, "MMM d, yyyy"),
                time: format(publishedAt, "h:mm a"),
              }}
            />
          </p>
        )}
      </div>
    </div>
  );
};
