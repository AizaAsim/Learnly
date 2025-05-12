import SelectDate from "@/components/ui/select-date";
import { useChooseScheduleDate } from "../hooks/useChooseScheduleDate";

interface ChooseDateProps {
  onNext: () => void;
}

export const ChooseDate = ({ onNext }: ChooseDateProps) => {
  const { scheduleDate, onDateSelect, disabledDates } = useChooseScheduleDate();

  return (
    <SelectDate
      selectedDate={scheduleDate}
      onDateSelect={onDateSelect}
      handleNext={onNext}
      disabled={disabledDates}
    />
  );
};
