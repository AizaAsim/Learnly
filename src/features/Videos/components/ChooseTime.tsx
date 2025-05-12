import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import {
  setScheduleTime,
  setScheduleDate,
} from "@/store/reducers/reelUploadReducer";
import {
  selectScheduleTime,
  selectTempScheduleDateAsString,
} from "@/store/selectors/reelUploadSelectors";
import { addMinutes, format, parse, setHours, setMinutes } from "date-fns";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ChooseTimeProps {
  onNext?: () => void;
  buttonText?: string;
}

export const ChooseTime = ({ onNext, buttonText }: ChooseTimeProps) => {
  const dispatch = useDispatch();
  const tempScheduleDate = useSelector(selectTempScheduleDateAsString);
  const scheduleTime = useSelector(selectScheduleTime) ?? "";

  const initialTime = scheduleTime
    ? parse(scheduleTime, "HH:mm", new Date())
    : addMinutes(new Date(), 30);

  const [selectedTime, setSelectedTime] = useState(initialTime);

  const handleTimeChange = (
    newHour: number,
    newMinute: number,
    newPeriod: "AM" | "PM"
  ) => {
    let hours = newHour;
    if (newPeriod === "PM" && newHour !== 12) {
      hours += 12;
    } else if (newPeriod === "AM" && newHour === 12) {
      hours = 0;
    }

    const newTime = setMinutes(setHours(selectedTime, hours), newMinute);
    setSelectedTime(newTime);
  };

  const handleSave = () => {
    const timeString = format(selectedTime, "HH:mm");
    if (tempScheduleDate) dispatch(setScheduleDate(tempScheduleDate));
    dispatch(setScheduleTime(timeString));
    onNext?.();
  };

  return (
    <div className="flex flex-col gap-4 w-[311px] max-w-full mx-auto">
      <TimePicker
        initialHour={selectedTime.getHours() % 12 || 12}
        initialMinute={selectedTime.getMinutes()}
        initialPeriod={selectedTime.getHours() >= 12 ? "PM" : "AM"}
        onChange={handleTimeChange}
      />
      <Button onClick={handleSave}>{buttonText}</Button>
    </div>
  );
};
