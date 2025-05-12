import { useTranslation } from "react-i18next";
import { MenuActionButton } from "../HeaderAction";
import { useCurrentReel } from "@/features/Videos/hooks/useCurrentReel";
import { useDispatch } from "react-redux";
import { useVideoScheduleModals } from "@/features/Videos/hooks/useVideoScheduleModals";
import { setTempScheduleDate } from "@/store/reducers/reelUploadReducer";
import { dateToString, timestampToDate } from "@/lib/utils";

export const ScheduleReel = ({
  onClick,
  reschedule = false,
}: {
  onClick: () => void;
  reschedule?: boolean;
}) => {
  const { t } = useTranslation();
  const { reel } = useCurrentReel();
  const dispatch = useDispatch();
  const { openChooseDate } = useVideoScheduleModals();

  const openScheduleModal = () => {
    if (!reel) return;

    if (reel.scheduledAt) {
      const date = timestampToDate(reel.scheduledAt);
      const dateStr = dateToString(date);
      dispatch(setTempScheduleDate(dateStr));
    }
    openChooseDate();
  };

  return (
    <MenuActionButton
      icon={reschedule ? "/icon/reschedule.svg" : "/icon/schedule.svg"}
      action={() => {
        openScheduleModal();
        onClick();
      }}
      text={
        reschedule
          ? t("videoPlayer_menu_btn_reschedule")
          : t("videoPlayer_menu_btn_schedule")
      }
    />
  );
};
