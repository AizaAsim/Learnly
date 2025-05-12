import { useTranslation } from "react-i18next";
import { useReportReel } from "@/features/Videos/hooks/reel-actions/useReportReel";
import { MenuActionButton } from "../HeaderAction";
import { useReport } from "@/hooks/useReport";
import { ReportType } from "@/services/callable";

export const ReportReel = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { handleReport } = useReportReel();
  const { report } = useReport(ReportType.REEL, handleReport);

  return (
    <MenuActionButton
      icon="/icon/Flag.svg"
      action={() => {
        report();
        onClick();
      }}
      text={t("videoPlayer_text_report")}
    />
  );
};
