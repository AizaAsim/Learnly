import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Error({ children, className }: Props) {
  return (
    <span
      className={cn(
        `font-medium text-red text-xs/4 -tracking-[0.12px]`,
        className
      )}
    >
      {children}
    </span>
  );
}
