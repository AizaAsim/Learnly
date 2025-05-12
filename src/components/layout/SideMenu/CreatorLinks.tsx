import { ComponentProps } from "react";
import { SideMenuLink } from "./SideMenuLink";
import { AddReelButton } from "../AddReelButton";
import { useTranslation } from "react-i18next";
import { useDeviceType } from "@/hooks/useDeviceType";
import { cn } from "@/lib/utils";

interface Props extends ComponentProps<"nav"> {
  isExtendedOnLargeScreen?: boolean;
}

export function CreatorLinks({ isExtendedOnLargeScreen, ...props }: Props) {
  const { t } = useTranslation();
  const { isTablet } = useDeviceType();

  return (
    <nav {...props}>
      <SideMenuLink
        icon="/icon/home.svg"
        text={t("nav_link_home")}
        to="/home"
      />
      <AddReelButton
        iconOnly={isExtendedOnLargeScreen ? isTablet : true}
        className={cn("w-full", { "lg:w-auto": isExtendedOnLargeScreen })}
      />
      <SideMenuLink
        icon="/icon/star-1.svg"
        text={t("nav_link_subscribers")}
        to="/learners"
      />
      <SideMenuLink
        icon="/icon/user.svg"
        text={t("nav_link_profile")}
        to="/my-profile"
      />
      <SideMenuLink
        icon="/icon/setting.svg"
        text={t("nav_link_settings")}
        to="/settings"
      />
    </nav>
  );
}
