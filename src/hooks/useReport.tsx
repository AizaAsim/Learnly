import { ReportEntity } from "@/components/ReportEntity";
import { useModal } from "@/hooks/useModal";
import { ReportType } from "@/services/callable";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useReport(
  type: ReportType,
  handleReport: () => Promise<void> | void
) {
  const { t } = useTranslation(undefined, { keyPrefix: "report" });
  const { setModal, openModal, closeModal } = useModal();

  const report = useCallback(() => {
    setModal(
      <ReportEntity
        reportClick={handleReport}
        closeModal={closeModal}
        reportButtonText={t("headline")}
        cancelButtonText={t("cancel")}
      />,
      {
        title: t("headline"),
        subtitle: t("description", {
          type: type === ReportType.REEL ? "reel" : "profile",
        }),
      }
    );
    openModal();
  }, [t, setModal, openModal, closeModal, type, handleReport]);

  return {
    report,
  };
}
