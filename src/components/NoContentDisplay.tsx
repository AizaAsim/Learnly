import { useBanner } from "@/hooks/useBanner";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function NoContentDisplay({
  text,
  iconSrc,
  className,
  textClassName,
}: {
  text: ReactNode; // Allows both strings and JSX elements;
  iconSrc: string;
  className?: string;
  textClassName?: string;
}) {
  const { bannerHeight } = useBanner();
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center",
        `absolute inset-0 h-[calc(100vh-${bannerHeight}px)] overflow-hidden`,
        className
      )}
    >
      <img
        src={iconSrc}
        alt="Empty Content"
        className="w-[46px] aspect-square mb-3"
      />
      <p
        className={cn(
          "text-primaryBlue text-center text-lg leading-6 font-semibold w-56 -tracking-[0.18px]",
          textClassName
        )}
      >
        {text}
      </p>
    </div>
  );
}
