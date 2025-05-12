import SvgIcon from "@/components/ui/svg-icon";
import { hasUnreadNotificationsSelector } from "@/store/selectors/notificationSelectors";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { TabbedLinkVariants } from "./variants";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  className?: string;
  icon: string;
  to: string;
  variant?: VariantProps<typeof TabbedLinkVariants>["variant"];
  opts?: {
    strokeColor?: string;
    activeStrokeColor?: string;
    strokeWidth?: string;
    activeStrokeWidth?: string;
    fill?: string;
    activeFill?: string;
    opacity?: string;
    activeOpacity?: string;
  };
  showBadge?: boolean;
  disabled?: boolean;
};

export const BottomNavLink = ({
  icon,
  to,
  opts,
  variant,
  className,
  showBadge = false,
  disabled = false,
}: Props) => {
  const location = useLocation();
  const isActive = location.pathname.includes(to);
  const hasUnreadNotification = useSelector(hasUnreadNotificationsSelector);

  const { strokeWidth, fill, opacity, strokeColor } = isActive
    ? {
        strokeColor:
          opts?.activeStrokeColor || variant === "blurred"
            ? "rgb(255, 255, 255)"
            : "rgb(1, 0, 1)",
        strokeWidth: opts?.activeStrokeWidth || "2.33",
        fill:
          opts?.activeFill || variant === "blurred"
            ? "rgb(255, 255, 255)"
            : "rgb(1, 0, 1)",
        opacity: opts?.activeOpacity || "1",
      }
    : {
        strokeColor:
          opts?.strokeColor || variant === "blurred"
            ? "rgba(255,255,255,0.6)"
            : "rgba(1,0,1,0.7)",
        strokeWidth: opts?.strokeWidth || "2.33",
        fill: opts?.fill || "none",
        opacity: opts?.opacity || "1",
      };

  const isDisabled = useMemo(() => {
    return disabled || isActive;
  }, [disabled, isActive]);

  return (
    <Link
      to={to}
      aria-disabled={isDisabled}
      className={cn("relative", {
        "pointer-events-none": isDisabled,
      })}
    >
      <SvgIcon
        className={cn(`w-9 h-9`, className)}
        src={icon}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fill}
        opacity={opacity}
        width="28"
        height="28"
      />
      {showBadge && hasUnreadNotification && (
        <div className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red border-[2px] border-light-T100 rounded-full" />
      )}
    </Link>
  );
};
