import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  separator?: boolean;
}

export function TextSeparator({ separator = true, children }: Props) {
  return (
    <div className="flex justify-center items-center my-3.5 md:my-5 px-[72px] md:px-[94px] gap-x-3">
      {separator && <Separator className={classes.separator} />}
      <span className="text-[14px]/[18px] text-dark-T50 font-medium -tracking-[0.14px]">
        {children}
      </span>
      {separator && <Separator className={classes.separator} />}
    </div>
  );
}

const classes = {
  separator: "bg-dark-T8",
};
