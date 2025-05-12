import { NoContentDisplay } from "@/components/NoContentDisplay";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import NotificationList from "@/features/Notifications/components/NotificationList.tsx";
import { useDeviceType } from "@/hooks/useDeviceType";
import { notificationsCountSelector } from "@/store/selectors/notificationSelectors";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const { t } = useTranslation();
  const notificationCount = useSelector(notificationsCountSelector);
  const { isMobile } = useDeviceType();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMobile) navigate("/");
  }, [isMobile, navigate]);

  return (
    <ScrollViewContainer className="flex w-full justify-center items-center overflow-y-auto">
      <div className="h-full flex flex-col w-full md:max-w-[647px]">
        {notificationCount === 0 ? (
          <NoContentDisplay
            text={t("notifications_empty_text")}
            iconSrc="/icon/notifications-light.svg"
            textClassName="w-[179px]"
          />
        ) : (
          <NotificationList />
        )}
      </div>
    </ScrollViewContainer>
  );
};

export default NotificationsPage;
