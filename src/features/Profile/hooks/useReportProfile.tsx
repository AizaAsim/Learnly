import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModal";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ReportType, submitReport } from "@/services/callable";
import { logInfo } from "@/services/logging";
import { useSelector } from "react-redux";
import { selectCreatorProfileData } from "@/store/selectors/creatorProfileSelectors";

export function useReportProfile() {
  const profileData = useSelector(selectCreatorProfileData);
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { toast } = useToast();

  const handleReport = useCallback(async () => {
    try {
      if (!profileData?.id) return;

      await submitReport({
        type: ReportType.USER,
        userId: profileData.id,
      });
      toast({
        text: t("report.reported"),
        variant: "success",
      });
    } catch (e) {
      let message = t("report.error");
      if (e instanceof Error) message = e.message;
      logInfo({ message });
      toast({
        text: message,
        variant: "destructive",
        className: "w-72",
        duration: 5000,
      });
    } finally {
      closeModal();
    }
  }, [profileData, closeModal, toast, t]);

  return { handleReport };
}
