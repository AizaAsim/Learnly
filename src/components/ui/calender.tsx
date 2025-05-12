import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button/variants";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-1.5",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label:
          "font-bold text-[15px] text-grayscale-100 leading-5 -tracking-[0.225px]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "none" }),
          "bg-grayscale-8 p-[9px] rounded-xl"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex h-10 items-center justify-center gap-[3.17px]",
        head_cell:
          "text-grayscale-30 rounded-md w-11 font-medium text-[13px] leading-4 -tracking-[0.195px]",
        row: "flex w-full gap-[3.17px] justify-center",
        cell: cn(
          "relative p-0 text-center focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-11 text-grayscale-80 text-base font-semibold p-0 aria-selected:opacity-100 rounded-[10px] -tracking-[0.16px] leading-[22px]"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-grayscale-100 text-light-T100 hover:text-light-T100 !-tracking-[0.14px]",
        day_today: "font-semibold",
        day_outside: "day-outside",
        day_disabled:
          "!text-grayscale-30 text-sm font-normal leading-[18px] !-tracking-[0.14px]",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <img
            src="/icon/chevron-left-date-picker.svg"
            className="size-[18px]"
          />
        ),
        IconRight: () => (
          <img
            src="/icon/chevron-right-date-picker.svg"
            className="size-[18px]"
          />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
