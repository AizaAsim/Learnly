import { useModal } from "@/hooks/useModal";
import { useTranslation } from "react-i18next";
import { ChooseDate } from "../components/ChooseDate";
import { ChooseTime } from "../components/ChooseTime";
import { ConfirmNewSchedule } from "../components/ConfirmNewSchedule";
import { useCurrentReel } from "./useCurrentReel";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { resetScheduleDateTime } from "@/store/reducers/reelUploadReducer";

export const useVideoScheduleModals = () => {
  const { t } = useTranslation();
  const { reel } = useCurrentReel();
  const { setModal, openModal, setOnCloseModal, setIsOpen } = useModal();
  const dispatch = useDispatch<AppDispatch>();

  const onClose = () => {
    dispatch(resetScheduleDateTime());
    setIsOpen(false);
  };

  const openChooseDate = () => {
    setOnCloseModal(onClose);
    setModal(<ChooseDate onNext={openChooseTime} />, {
      title: t("reelUpload_chooseDate_title"),
    });
    openModal();
  };

  const openChooseTime = () => {
    setOnCloseModal(onClose);
    setModal(
      <ChooseTime
        onNext={openConfirmNewSchedule}
        buttonText={t("videoPlayer_chooseTime_modal_next")}
      />,
      {
        title: t("reelUpload_chooseTime_title"),
      },
      {
        showBackIcon: true,
        onBackClick: openChooseDate,
      }
    );
    openModal();
  };

  const openConfirmNewSchedule = () => {
    setOnCloseModal(onClose);
    setModal(
      <ConfirmNewSchedule reel={reel} />,
      {
        title: t("videoPlayer_newSchedule_modal_title"),
        subtitle: t("videoPlayer_newSchedule_modal_subtitle"),
      },
      {
        showBackIcon: true,
        onBackClick: openChooseTime,
      }
    );
    openModal();
  };

  return {
    openChooseDate,
    openChooseTime,
    openConfirmNewSchedule,
  };
};
