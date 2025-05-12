import { useAuth } from "@/features/Auth/hooks/useAuth";
import { ComponentProps, ReactNode } from "react";
import { Roles } from "../../../features/Auth/types";
import { CreatorLinks } from "../SideMenu/CreatorLinks";
import { UserLinks } from "../SideMenu/UserLinks";
import { cn } from "@/lib/utils";
import { Settings } from "@/features/Settings/components/Settings";

type Props = ComponentProps<"div"> & {
  footer?: ReactNode;
  isExtendedOnLargeScreen?: boolean;
  hasBanner?: boolean;
  bannerHeight?: number;
};

export function SideMenu({
  footer,
  isExtendedOnLargeScreen,
  hasBanner,
  bannerHeight,
  ...props
}: Props) {
  const { currentRole } = useAuth();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-[100dvh] flex",
        hasBanner && `top-[${bannerHeight}] h-[calc(100dvh-${bannerHeight})]}`
      )}
    >
      <div
        {...props}
        className={cn(
          "h-[100dvh] w-[76px] border-r border-grayscale-8 border-l-none flex flex-col justify-between",
          {
            "lg:w-[242px]": isExtendedOnLargeScreen,
            "h-[calc(100dvh-74px)]": hasBanner,
          }
        )}
      >
        <div>
          <div>
            {isExtendedOnLargeScreen && (
              <img
                src="/img/logo.svg"
                alt="logo"
                className="w-full h-[74px] hidden lg:block"
              />
            )}
            <img
              src="/img/logo-icon-only.svg"
              alt="logo"
              className={cn("w-8 h-8 mx-auto mt-6 mb-5 block", {
                "lg:hidden": isExtendedOnLargeScreen,
              })}
            />
          </div>

          <div
            className={cn("rounded-full mt-7", {
              "lg:bg-transparent lg:rounded-none lg:mx-3 lg:mt-5":
                isExtendedOnLargeScreen,
            })}
          >
            {currentRole === Roles.USER && <UserLinks />}

            {currentRole === Roles.CREATOR && <CreatorLinks />}
          </div>
        </div>
        <hr
          className={cn(
            "h-[3px] bg-grayscale-4 rounded-[2px] w-8 mx-auto mt-auto",
            {
              "lg:w-52": isExtendedOnLargeScreen,
            }
          )}
        />

        <div
          className={cn("my-5 rounded-full mt-7", {
            "lg:mx-3 lg:bg-transparent lg:rounded-none":
              isExtendedOnLargeScreen,
          })}
        >
          {footer}
        </div>
      </div>
      {location.pathname.includes("settings") && (
        <div className="pt-2 px-4 w-[277px] hidden lg:block border border-grayscale-8">
          <h3 className="px-4 py-[18px] text-xl font-bold text-primaryBlue">Settings</h3>
          <Settings isSideMenu={true} />
        </div>
      )}
    </aside>
  );
}
