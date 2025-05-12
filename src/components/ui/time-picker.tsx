import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";

interface CellProps {
  value: number | string;
  isSelected: boolean;
  onClick: () => void;
}

const Cell = ({ value, isSelected, onClick }: CellProps) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
  });

  return (
    <div
      className={cn(
        "w-[84px] h-[38px] cursor-pointer text-grayscale-70 rounded-[10px] transition-all duration-500 flex justify-center items-center fonr-semibold leading-[22px]",
        {
          "bg-grayscale-4 text-grayscale-100": isSelected,
          "text-grayscale-8": !isIntersecting,
          "text-grayscale-16": isSelected && !isIntersecting,
        }
      )}
      ref={ref}
      onClick={onClick}
    >
      {value}
    </div>
  );
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const PERIODS = ["AM", "PM"] as const;

interface TimePickerProps {
  initialHour?: number;
  initialMinute?: number;
  initialPeriod?: "AM" | "PM";
  onChange?: (hour: number, minute: number, period: "AM" | "PM") => void;
}

export const TimePicker = ({
  initialHour = 9,
  initialMinute = 10,
  initialPeriod = "AM",
  onChange,
}: TimePickerProps) => {
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(
    initialPeriod
  );
  const hourContainerRef = useRef<HTMLDivElement>(null);
  const minuteContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    newHour: number | null,
    newMinute: number | null,
    newPeriod: "AM" | "PM" | null
  ) => {
    const hour = newHour ?? selectedHour;
    const minute = newMinute ?? selectedMinute;
    const period = newPeriod ?? selectedPeriod;

    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);

    onChange?.(hour, minute, period);
  };

  const scrollToSelected = (
    containerRef: RefObject<HTMLDivElement>,
    index: number
  ) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const cellHeight = container.children[0].clientHeight; // height of each cell
      const scrollPosition =
        index * cellHeight - container.clientHeight / 2 + cellHeight / 2;
      container.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToSelected(hourContainerRef, selectedHour - 1);
    scrollToSelected(minuteContainerRef, selectedMinute);
  }, [selectedHour, selectedMinute]);

  return (
    <motion.div
      className="flex justify-center gap-3.5 w-[280px] text-base -tracking-[0.16px] font-semibold"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        <motion.div
          className="h-[266px] overflow-y-auto scrollbar-hide"
          key="hours"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          ref={hourContainerRef}
        >
          {HOURS.map((hour) => (
            <Cell
              key={hour}
              value={hour}
              onClick={() => handleChange(hour, null, null)}
              isSelected={hour === selectedHour}
            />
          ))}
        </motion.div>
        <motion.div
          className="h-[266px] overflow-y-auto scrollbar-hide"
          key="minutes"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          ref={minuteContainerRef}
        >
          {MINUTES.map((minute) => (
            <Cell
              key={minute}
              value={minute.toString().padStart(2, "0")}
              onClick={() => handleChange(null, minute, null)}
              isSelected={minute === selectedMinute}
            />
          ))}
        </motion.div>
        <motion.div
          className="h-[266px] overflow-y-auto scrollbar-hide flex flex-col justify-center"
          key="periods"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {PERIODS.map((period) => (
            <Cell
              key={period}
              value={period}
              onClick={() => handleChange(null, null, period)}
              isSelected={period === selectedPeriod}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
