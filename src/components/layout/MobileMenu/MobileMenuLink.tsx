import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import SvgIcon from "@/components/ui/svg-icon";
import { cn } from "@/lib/utils";
import { hasUnreadNotificationsSelector } from "@/store/selectors/notificationSelectors";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, LinkProps, useLoaderData, useLocation } from "react-router-dom";

interface MobileMenuLinkProps extends LinkProps {
  icon: string;
  to: string;
  text: string;
  endIcon?: string;
  opts?: {
    strokeWidth?: string;
    activeStrokeWidth?: string;
    fill?: string;
    activeFill?: string;
    opacity?: string;
    activeOpacity?: string;
  };
  onClick?: () => void;
  showBadge?: boolean;
  disabled?: boolean;
}

export const MobileMenuLink = ({
  icon,
  text,
  to,
  className,
  endIcon,
  opts,
  onClick,
  disabled = false,
  showBadge = false,
  ...props
}: MobileMenuLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  const loaderData = useLoaderData() as { id: string };
  const isReelPage = loaderData?.id; // all pages with a reel have an id

  const hasUnreadNotification = useSelector(hasUnreadNotificationsSelector);

  const { strokeWidth, fill, opacity } = isActive
    ? {
        strokeWidth: opts?.activeStrokeWidth || "1",
        fill: opts?.activeFill || "black",
        opacity: opts?.activeOpacity || "1",
      }
    : {
        strokeWidth: opts?.strokeWidth || "2.33333",
        fill: opts?.fill || "none",
        opacity: opts?.opacity || "1",
      };

  const isDisabled = useMemo(() => {
    return disabled || isActive;
  }, [disabled, isActive]);

  return (
    <DropdownMenuItem asChild>
      <Link
        to={to}
        aria-disabled={isDisabled}
        className={cn(
          "py-2 px-2 flex items-center gap-1.5 font-semibold text-sm -tracking-[0.14px] leading-4.5 w-full cursor-pointer hover:bg-grayscale-4",
          `opacity-[${opacity}]`,
          {
            "filter brightness-0 invert": isReelPage,
            "pointer-events-none": isDisabled,
          },
          className
        )}
        {...props}
        onClick={onClick}
      >
        <SvgIcon
          className="relative"
          src={icon}
          width="22px"
          height="22px"
          strokeWidth={strokeWidth}
          fill={fill}
        />

        <span>{text}</span>
        {endIcon && <SvgIcon className="h-[22px] ml-auto" src={endIcon} />}
        {showBadge && hasUnreadNotification && (
          <div className="absolute top-[7px] left-6 w-2.5 h-2.5 bg-red border-[2px] border-light-T100 rounded-full" />
        )}
      </Link>
    </DropdownMenuItem>
  );
};
