import { useDeviceType } from "@/hooks/useDeviceType";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useReelDescription } from "@/features/Profile/hooks/useReelDescription";

export const ReelDescription = ({
  className,
  text,
}: {
  className?: string;
  text: string;
}) => {
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();
  const {
    isDescriptionExpanded,
    isDescriptionLengthExceeding,
    toggleDescriptionExpansion,
  } = useReelDescription(text);

  return (
    <p
      className={cn(
        "w-full text-sm md:text-base font-normal flex flex-wrap items-start gap-1",
        {
          "gap-1.5": isDescriptionExpanded,
          "text-light-T90 leading-4.5 -tracking-[0.14px]": isMobile,
          "text-dark-T80 leading-snug": !isMobile,
        },
        className
      )}
    >
      <span className="break-words">
        {isDescriptionExpanded || !isDescriptionLengthExceeding
          ? text
          : `${text.substring(0, isMobile ? 37 : 47)}...`}
      </span>

      {isDescriptionLengthExceeding && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDescriptionExpansion}
          className={cn(
            "font-semibold h-auto p-0 hover:text-light-T80 inline-flex",
            {
              "text-white text-sm leading-4.5 -tracking-[0.14px]": isMobile,
              "text-black text-base leading-snug": !isMobile,
            }
          )}
        >
          {isDescriptionExpanded
            ? t("videoPlayer_text_less")
            : t("videoPlayer_text_more")}
        </Button>
      )}
    </p>
  );
};
