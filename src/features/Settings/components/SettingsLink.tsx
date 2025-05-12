import { cn } from "@/lib/utils";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";

interface SettingsLinkProps extends ComponentPropsWithoutRef<"div"> {
  text: string;
  icon?: string;
  children?: ReactNode;
  disabled?: boolean;
  pathname?: string;
}

export const SettingsLink = forwardRef<HTMLDivElement, SettingsLinkProps>(
  (
    {
      className,
      text,
      icon,
      disabled,
      onClick,
      onMouseEnter,
      onMouseLeave,
      children,
      pathname,
      ...props
    },
    ref
  ) => {
    const isInteractive = (!!onClick || !!children) && !disabled;
    const location = useLocation();

    const { isSideMenu } = useSettings();

    const isActive = useMemo(() => {
      if (pathname) {
        return location.pathname === pathname;
      }

      const settingRoute = text.toLowerCase().replaceAll(" ", "-");
      return location.pathname.includes(settingRoute);
    }, [pathname, location.pathname, text]);

    return (
      <>
        <div
          ref={ref}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={cn(
            "flex items-center first-of-type:rounded-t-[18px] last-of-type:rounded-b-[18px] cursor-not-allowed opacity-60 px-4 py-3.5 md:px-5 md:py-4",
            {
              "cursor-pointer opacity-100": isInteractive,
              "lg:bg-transparent lg:px-4 lg:py-3 lg:rounded-2xl": isSideMenu,
              "lg:bg-light": isActive,
            },
            className
          )}
          {...props}
        >
          <div className="flex w-full items-center justify-between">
            <div className={cn("flex items-center")}>
              {icon && (
                <img
                  className={cn("size-6", { "lg:size-7": !isSideMenu })}
                  src={icon}
                />
              )}
              <h2
                className={cn("text-sm lg:text-base font-medium", {
                  "ml-4": icon,
                  "lg:text-[15px] font-semibold ml-2.5 text-primaryBlue": isSideMenu,
                })}
              >
                {text}
              </h2>
            </div>
            {!isSideMenu &&
              (children ?? (
                <img
                  src="/icon/chevron-right-settings.svg"
                  className="size-5"
                />
              ))}
          </div>
        </div>
        {!isSideMenu && (
          <div className="max-w-full h-px bg-dark-T4 rounded-[1px] last-of-type:hidden xs:mx-4 md:mx-6" />
        )}
      </>
    );
  }
);

SettingsLink.displayName = "SettingsLink";
