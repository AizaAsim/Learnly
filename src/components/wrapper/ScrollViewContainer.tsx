import { useRemainingHeight } from "@/hooks/useRemainingHeight";
import { ReactNode } from "react";

export function ScrollViewContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { remainingHeight, containerRef } = useRemainingHeight();
  return (
    <div
      className={className}
      ref={containerRef}
      style={{ height: `${remainingHeight}px` }}
    >
      {children}
    </div>
  );
}
