import { ComponentProps } from "react";
import { SideMenuLink } from "./SideMenuLink";
import { useTranslation } from "react-i18next";

type Props = ComponentProps<"nav">;

export function UserLinks(props: Props) {
  const { t } = useTranslation();

  return (
    <nav {...props}>
      <SideMenuLink
        icon="/icon/home.svg"
        text={t("nav_link_home")}
        to="/home"
      />
      <SideMenuLink
        icon="/icon/search.svg"
        text={t("nav_link_search")}
        to="/search"
        opts={{
          strokeWidth: "0.5",
          activeStrokeWidth: "1",
        }}
      />
      <SideMenuLink
        icon="/icon/star-1.svg"
        text={t("nav_link_subscriptions")}
        to="/subscriptions"
      />
      <SideMenuLink
        icon="/icon/save.svg"
        text={t("nav_link_saved")}
        to="/saved"
      />
    </nav>
  );
}
