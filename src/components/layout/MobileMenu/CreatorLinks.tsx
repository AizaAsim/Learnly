import { useTranslation } from "react-i18next";
import { MobileMenuLink } from "./MobileMenuLink";
import { AddReelButton } from "../AddReelButton";

interface CreatorLinksProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const CreatorLinks = ({ setIsMenuOpen }: CreatorLinksProps) => {
  const { t } = useTranslation();

  return (
    <>
      <MobileMenuLink
        icon="/icon/home.svg"
        text={t("nav_link_home")}
        to="/home"
        onClick={() => setIsMenuOpen(false)}
      />
      <AddReelButton
        iconHeight="22px"
        iconWidth="22px"
        setIsMenuOpen={setIsMenuOpen}
        className="h-[38px] gap-1.5 font-semibold -tracking-[0.14px] leading-4.5 hover:bg-dark-T4 w-full justify-start"
      />
      <MobileMenuLink
        icon="/icon/notification-small.svg"
        text={t("nav_link_notifications")}
        to="/notifications"
        onClick={() => setIsMenuOpen(false)}
        showBadge
      />
      <MobileMenuLink
        icon="/icon/user.svg"
        text={t("nav_link_profile")}
        to="/my-profile"
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileMenuLink
        icon="/icon/star-1.svg"
        text={t("nav_link_subscribers")}
        to="/learners"
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileMenuLink
        icon="/icon/settings.svg"
        text={t("nav_link_settings")}
        to="/settings"
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};
