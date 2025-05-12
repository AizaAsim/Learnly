import { useTranslation } from "react-i18next";
import { MenuActionButton } from "../HeaderAction";
import { useCallback } from "react";
import { useModal } from "@/hooks/useModal";
import { logError } from "@/services/logging";
import { EditDetailsForm } from "../../EditDetailsForm";
import { useCurrentReel } from "@/features/Videos/hooks/useCurrentReel";

export const EditDetails = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { setModal, openModal } = useModal();
  const { reel } = useCurrentReel();

  const openEditModal = useCallback(() => {
    if (!reel) {
      logError("No EduClip Found");
      return;
    }
    setModal(<EditDetailsForm reel={reel} />, {
      title: t("reelUpload_editDetails_title"),
    });
    openModal();
  }, [openModal, reel, setModal, t]);

  return (
    <MenuActionButton
      icon="/icon/edit.svg"
      action={() => {
        openEditModal();
        onClick();
      }}
      text={t("videoPlayer_menu_btn_edit")}
    />
  );
};
