import { cn } from "@/lib/utils";
import "@/styles/animations/spin.css";

export function Spinner({
  className,
  fullScreen = false,
}: {
  className?: string;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full h-full flex justify-center items-center",
        { "fixed inset-0": fullScreen },
        className
      )}
    >
      <img className="spin" src="/img/logo-icon-only.svg" />
    </div>
  );
}
