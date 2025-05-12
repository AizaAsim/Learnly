import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface SwitchProps {
  value: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch: FC<SwitchProps> = ({ value, onChange }) => {
  return (
    <label
      className="inline-flex items-center cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={value}
        onChange={onChange}
      />
      <div
        className={cn(
          `relative xs:w-10 xs:h-6 md:w-[46px] md:h-7 outline-none bg-grayscale-12 peer-focus:outline-none  rounded-full peer  after:content-[''] after:absolute after:top-[3px] sm:after:top-[3px] after:start-[3px] after:bg-[#FFFFFF]  after:rounded-full xs:after:h-[18px] xs:after:w-[18px] md:after:h-[22px] md:after:w-[22px] after:transition-all peer-checked:bg-green ${value ? `xs:peer-checked:after:translate-x-[16px] md:peer-checked:after:translate-x-[17.5px] xs:rtl:peer-checked:after:-translate-x-[16px] md:rtl:peer-checked:after:-translate-x-[17.5px]` : ``}`
        )}
      ></div>
    </label>
  );
};
