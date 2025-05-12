import { differenceInSeconds, isPast } from "date-fns";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";

const scheduleLimit = parseInt(import.meta.env.VITE_MAX_SCHEDULE_DAYS);

export const useScheduleDateValidator = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const validateScheduleDate = (date: Date): boolean => {
    if (isPast(date)) {
      toast({
        text: t("reelUpload_schedule_error_past"),
      });
      return false;
    }

    const now = new Date();
    const differenceInSec = differenceInSeconds(date, now);
    const scheduleLimitInSeconds = scheduleLimit * 24 * 60 * 60; // Convert days to seconds

    if (differenceInSec > scheduleLimitInSeconds) {
      toast({
        text: t("reelUpload_schedule_error_limit", {
          limit: scheduleLimit,
        }),
      });
      return false;
    }

    return true;
  };

  return { validateScheduleDate };
};
