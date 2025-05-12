import { cn, convert24hTo12h } from "@/lib/utils";
import { useVideoUploadModals } from "../../hooks/useVideoUploadModals";
import { useTranslation } from "react-i18next";

interface ScheduleFieldProps {
  scheduleDate: string | null;
  scheduleTime: string | null;
  scheduledUnderLimit: boolean;
}

export const ScheduleField = ({
  scheduleDate,
  scheduleTime,
  scheduledUnderLimit,
}: ScheduleFieldProps) => {
  const { openChooseDate } = useVideoUploadModals();
  const { t } = useTranslation();

  const handleClick = () => {
    if (scheduledUnderLimit) openChooseDate();
  };

  return (
    <div
      className={cn(
        "pl-4 h-[48px] flex items-center gap-1.5 bg-grayscale-4 rounded-[14px] has-[:focus-visible]:outline-none has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 cursor-pointer"
      )}
      onClick={handleClick}
    >
      {!scheduledUnderLimit ? (
        <img src="/icon/clock-light.svg" className="size-5" />
      ) : (
        <img src="/icon/clock.svg" className="size-5" />
      )}
      <div
        className={cn(
          "flex gap-1.5 w-full pl-0 border-0 rounded-2xl font-medium text-sm text-grayscale-100 cursor-pointer leading-[18px] -tracking-[0.14px]",
          {
            "text-grayscale-40": !scheduledUnderLimit,
          }
        )}
      >
        {scheduleDate || scheduleTime
          ? `${scheduleDate ?? "N/A"} , ${scheduleTime ? convert24hTo12h(scheduleTime) : "N/A"}`
          : t("reelUpload_button_schedule")}
        {!scheduledUnderLimit && (
          <span className="text-xs font-semibold -tracking-[0.12px] text-red px-2 py-0.5 bg-red-t10 rounded-full">
            {t("reelUpload_limitOver")}
          </span>
        )}
      </div>
      {!scheduledUnderLimit ? (
        <img src="/icon/chevron-right-light.svg" className="size-5 mr-4" />
      ) : (
        <img src="/icon/chevron-right.svg" className="size-5 mr-4" />
      )}
    </div>
  );
};
