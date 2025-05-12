import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { logInfo } from "@/services/logging";
import { ReportType, submitReport } from "@/services/callable";
import { useCurrentReel } from "../useCurrentReel";

export function useReportReel() {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { toast } = useToast();
  const { id, reel } = useCurrentReel();

  const handleReport = useCallback(async () => {
    // Grab the reel id from the URL
    if (!id || !reel) {
      logInfo("No reel or id found");
      return;
    }

    try {
      await submitReport({
        reelId: id,
        creatorId: reel.creatorId,
        type: ReportType.REEL,
      });
      toast({
        text: t("videoPlayer_text_reportSubmitted"),
        variant: "blur",
      });
    } catch (e) {
      toast({
        text: (e as Error).message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      closeModal();
    }
  }, [id, reel, closeModal, toast, t]);

  return { handleReport };
}
