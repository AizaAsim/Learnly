import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calender";
import { Matcher } from "react-day-picker";
import { useTranslation } from "react-i18next";

interface SelectDateProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  handleNext: () => void;
  disabled?: Matcher | Matcher[];
}

const SelectDate = ({
  selectedDate,
  onDateSelect,
  handleNext,
  disabled,
}: SelectDateProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex flex-col gap-1.5 w-full items-center justify-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => onDateSelect(date)}
        disabled={disabled}
        defaultMonth={selectedDate}
      />
      <Button onClick={handleNext} disabled={!selectedDate}>
        {t("reelUpload_button_next")}
      </Button>
    </div>
  );
};

export default SelectDate;
