import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useTranslation } from "react-i18next";

export const ArchivedLimitReached = () => {
  const { closeModal } = useModal();
  const { t } = useTranslation();
  return (
    <Button onClick={closeModal} className="w-full">
      {t("videoPlayer_guard_archived_limit_reached_dismiss")}
    </Button>
  );
};
