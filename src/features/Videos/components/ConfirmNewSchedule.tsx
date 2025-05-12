import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { convert24hTo12h } from "@/lib/utils";
import {
  selectScheduleDateAsString,
  selectScheduleTime,
} from "@/store/selectors/reelUploadSelectors";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useScheduleDateValidator } from "../hooks/useScheduleDateValidator";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch } from "@/store";
import { updateReel } from "@/store/reducers/myVideosReducer";
import { router } from "@/router";
import { ReelData } from "@/types";
import { resetScheduleDateTime } from "@/store/reducers/reelUploadReducer";

interface ConfirmNewScheduleProps {
  reel: ReelData | undefined;
}

export const ConfirmNewSchedule = ({ reel }: ConfirmNewScheduleProps) => {
  const { t } = useTranslation();
  const scheduleDate = useSelector(selectScheduleDateAsString);
  const scheduleTime = useSelector(selectScheduleTime);
  const { closeModal } = useModal();
  const { validateScheduleDate } = useScheduleDateValidator();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const scheduleReel = useCallback(
    async (date: string, time: string) => {
      if (!reel) return;
      try {
        const scheduledAt = new Date(`${date} ${time}`);
        if (!validateScheduleDate(scheduledAt)) return;

        const reelDoc = doc(firestore, `reels/${reel.id}`);
        await updateDoc(reelDoc, {
          scheduledAt,
        });
        const updated = {
          id: reel.id,
          data: {
            ...reel,
            type: "scheduled",
            scheduledAt: {
              _seconds: scheduledAt.getTime() / 1000,
              _nanoseconds: 0,
            },
          },
        };
        dispatch(updateReel(updated));
        toast({
          text:
            reel.type === "scheduled"
              ? t("videoPlayer_toast_reschedule_success")
              : t("videoPlayer_toast_schedule_success"),
          variant: "success",
        });
        router.navigate("/my-profile/scheduled");
        closeModal();
        dispatch(resetScheduleDateTime());
      } catch (error) {
        toast({
          text:
            reel.type === "scheduled"
              ? t("videoPlayer_toast_reschedule_error")
              : t("videoPlayer_toast_schedule_error"),
          variant: "destructive",
          duration: 5000,
        });
      }
    },
    [closeModal, dispatch, reel, t, toast, validateScheduleDate]
  );

  const handleCancel = useCallback(() => {
    dispatch(resetScheduleDateTime());
    closeModal();
  }, [closeModal, dispatch]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-grayscale-4 px-4 py-3.5 rounded-[14px] text-sm font-semibold leading-[18px] -tracking-[0.14px] flex items-center justify-between">
        <div className="flex gap-1.5 items-center">
          <img src="/icon/calender.svg" />
          <span>{scheduleDate}</span>
        </div>
        {scheduleTime && <span>{convert24hTo12h(scheduleTime)}</span>}
      </div>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => {
            if (scheduleDate && scheduleTime)
              scheduleReel(scheduleDate, scheduleTime);
          }}
        >
          {reel?.type === "scheduled"
            ? t("videoPlayer_newSchedule_modal_reschedule")
            : t("videoPlayer_newSchedule_modal_schedule")}
        </Button>
        <Button variant="ghost" size="none" onClick={handleCancel}>
          {t("videoPlayer_newSchedule_modal_cancel")}
        </Button>
      </div>
    </div>
  );
};
