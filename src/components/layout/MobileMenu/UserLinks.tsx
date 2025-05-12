import { useTranslation } from "react-i18next";
import { MobileMenuLink } from "./MobileMenuLink";
import { useDeviceType } from "@/hooks/useDeviceType";

interface UserLinksProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const UserLinks = ({ setIsMenuOpen }: UserLinksProps) => {
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();

  return (
    <>
      <MobileMenuLink
        icon="/icon/home.svg"
        text={t("nav_link_home")}
        to={"/home"}
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileMenuLink
        icon="/icon/search-1.svg"
        text={t("nav_link_search")}
        to="/search"
        onClick={() => setIsMenuOpen(false)}
      />
      {/* This menu is used in 1 place on desktop, and notifs route is only on mobile */}
      {isMobile && <MobileMenuLink
        icon="/icon/notification-small.svg"
        text={t("nav_link_notifications")}
        to="/notifications"
        onClick={() => setIsMenuOpen(false)}
        showBadge
      />}
      <MobileMenuLink
        icon="/icon/settings.svg"
        text={t("nav_link_settings")}
        to="/settings"
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileMenuLink
        icon="/icon/star-1.svg"
        text={t("nav_link_subscriptions")}
        to="/subscriptions"
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileMenuLink
        icon="/icon/save.svg"
        text={t("nav_link_saved")}
        to="/saved"
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};
