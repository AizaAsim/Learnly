import { cn, formatFullMonth } from "@/lib/utils";

interface MonthAxisLabelProps {
  x: number;
  y: number;
  payload: { value: string };
  selectedMonth?: string;
  onMonthSelect?: (month: string) => void;
}

export const MonthAxisLabel = ({
  x,
  y,
  payload,
  selectedMonth,
  onMonthSelect,
}: MonthAxisLabelProps) => {
  const shortMonth = payload.value;
  const fullMonth = formatFullMonth(shortMonth);
  const isSelected = fullMonth === selectedMonth;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor="middle"
        fill={isSelected ? "#1E3A8A/20" : "##1E3A8A"}
        className={cn("cursor-pointer text-xs -tracking-[0.12px] text-primaryBlue", {
          "font-semibold": isSelected,
          "font-medium": !isSelected,
        })}
        onClick={() => onMonthSelect?.(fullMonth)}
      >
        {shortMonth}
      </text>
    </g>
  );
};
