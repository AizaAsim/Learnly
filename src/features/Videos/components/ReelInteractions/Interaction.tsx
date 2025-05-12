import SvgIcon from "@/components/ui/svg-icon";
import { useDeviceType } from "@/hooks/useDeviceType";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export const Interaction = ({
  interactionId,
  icon,
  count,
  filled,
  onClick,
  className,
  disabled,
  fill = "",
}: {
  interactionId?: string;
  icon: string;
  count: number;
  filled?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fill?: string;
}) => {
  const { isMobile } = useDeviceType();

  const formatCount = (count: number) => {
    if (count < 1000) return count;
    if (count < 1000000) return Number(Math.floor(count / 1000).toFixed(2));
    return Number(Math.floor(count / 1000000));
  };

  const formatDenominator = (count: number) => {
    if (count < 1000) return "";
    if (count > 1000000) return "m";
    return "k";
  };

  const strokeColor = useMemo(() => {
    if (filled) return fill;
    return isMobile ? "#FFFFFFE6" : "#000000CC";
  }, [filled, fill, isMobile]);

  const fillColor = useMemo(() => {
    if (!filled) return "none";
    if (fill) return fill;
    return isMobile ? "#FFFFFFE6" : "#000000CC";
  }, [filled, fill, isMobile]);

  return (
    <div
      onClick={() => {
        if (disabled) return;
        onClick && onClick();
      }}
      className={cn("flex justify-center items-center", {
        "flex-row": !isMobile,
        "flex-col": isMobile,
        "cursor-pointer": onClick && !disabled,
      })}
    >
      <div
        className={cn(
          "relative",
          {
            "bg-black/5 rounded-full mr-1.5 p-1.5": !isMobile,
            "mb-[2px]": isMobile,
            "hover:bg-dark-T30": !!onClick && !disabled && !isMobile,
          },
          className
        )}
      >
        <SvgIcon
          src={icon}
          width={isMobile ? "34px" : "24px"}
          height={isMobile ? "34px" : "24px"}
          stroke={strokeColor}
          strokeWidth="1.5"
          fill={fillColor}
        />
        {interactionId && (
          <span
            id={interactionId}
            className="absolute inset-0 flex flex-col justify-center items-center"
          />
        )}
      </div>
      <p
        className={cn("", {
          "text-light-T90 text-[13px] font-medium leading-4 -tracking-[0.195px]":
            isMobile,
          "text-dark-T80 text-sm font-semibold leading-[18px]": !isMobile,
        })}
      >
        {formatCount(count)}
        {formatDenominator(count)}
      </p>
    </div>
  );
};
