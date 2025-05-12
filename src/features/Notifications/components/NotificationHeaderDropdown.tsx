import { UserActionDropdown } from "@/components/UserActionDropdown";
import { useTranslation } from "react-i18next";
import { useNotificationActions } from "../hooks/useNotificationAction";

const NotificationHeaderDropdown = () => {
  const { t } = useTranslation();
  const { handleClearAll } = useNotificationActions();

  const actions = [
    {
      label: t("notifications_header_menu_clear_all"),
      onClick: handleClearAll,
      iconSrc: "/icon/clear-all.svg",
      className: "text-grayscale-80",
    },
  ];

  return (
    <UserActionDropdown
      actions={actions}
      menuTriggerClassName="bg-transparent"
      menuContentClassName="shadow-blur-2xl"
    />
  );
};

export default NotificationHeaderDropdown;
