import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dateToString } from "@/lib/utils";
import { setTempScheduleDate } from "@/store/reducers/reelUploadReducer";
import { selectTempScheduleDate } from "@/store/selectors/reelUploadSelectors";
import { addDays } from "date-fns";

interface UseChooseScheduleDateReturn {
  scheduleDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  disabledDates: { before: Date; after: Date };
}

const today = new Date();
const scheduleLimit = parseInt(import.meta.env.VITE_MAX_SCHEDULE_DAYS);
const dateAfterScheduleLimit = addDays(today, scheduleLimit);

export const useChooseScheduleDate = (): UseChooseScheduleDateReturn => {
  const dispatch = useDispatch();
  const scheduleDate = useSelector(selectTempScheduleDate);

  const onDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        const dateStr = dateToString(date);
        dispatch(setTempScheduleDate(dateStr));
      }
    },
    [dispatch]
  );

  const disabledDates = { before: today, after: dateAfterScheduleLimit };

  return {
    scheduleDate,
    onDateSelect,
    disabledDates,
  };
};
