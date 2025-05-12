import SvgIcon from "@/components/ui/svg-icon";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { SideMenuTooltip } from "./SideMenuTooltip";

type Props = {
  icon: string;
  text: string;
  to: string;
  opts?: {
    strokeWidth?: string;
    activeStrokeWidth?: string;
    fill?: string;
    activeFill?: string;
    opacity?: string;
    activeOpacity?: string;
  };
  isExtendedOnLargeScreen?: boolean;
};

export const SideMenuLink = ({
  icon,
  text,
  to,
  opts,
  isExtendedOnLargeScreen,
}: Props) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  const { strokeWidth, fill, opacity } = isActive
    ? {
      strokeWidth: opts?.activeStrokeWidth || "1",
      fill: opts?.activeFill || "darkblue",
      opacity: opts?.activeOpacity || "1",
    }
    : {
      strokeWidth: opts?.strokeWidth || "2.33333",
      fill: opts?.fill || "none",
      opacity: opts?.opacity || "1",
    };

  return (
    <SideMenuTooltip tooltipText={text}>
      <Link
        to={to}
        className={cn(
          `flex items-center p-3 opacity-[${opacity}] justify-center leading-6 -tracking-[0.16px]`,
          {
            "font-semibold": isActive,
            "lg:justify-start": isExtendedOnLargeScreen,
          }
        )}
      >
        <SvgIcon src={icon} strokeWidth={strokeWidth} fill={fill} />
        <span
          className={cn("hidden ml-3", {
            "lg:inline": isExtendedOnLargeScreen,
          })}
        >
          {text}
        </span>
      </Link>
    </SideMenuTooltip>
  );
};
