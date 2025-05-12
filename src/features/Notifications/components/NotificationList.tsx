import NotificationsGroup from "@/features/Notifications/components/NotificationsGroup.tsx";
import {
  lastMonthNotificationsSelector,
  lastWeekNotificationsSelector,
  newNotificationsSelector,
  olderNotificationsSelector,
  todayNotificationsSelector,
} from "@/store/selectors/notificationSelectors.ts";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const NotificationList = () => {
  const { t } = useTranslation();
  const newNotifications = useSelector(newNotificationsSelector);
  const todayNotifications = useSelector(todayNotificationsSelector);
  const lastWeekNotifications = useSelector(lastWeekNotificationsSelector);
  const lastMonthNotifications = useSelector(lastMonthNotificationsSelector);
  const olderNotifications = useSelector(olderNotificationsSelector);

  return (
    <div className="flex flex-col gap-4 mt-3 md:mt-0 md:gap-3.5 md:px-4 md:py-3.5 md:overflow-hidden">
      {newNotifications.length > 0 && (
        <NotificationsGroup
          title={t("notifications_timeStamps.new")}
          list={newNotifications}
        />
      )}

      {todayNotifications.length > 0 && (
        <NotificationsGroup
          title={t("notifications_timeStamps.today")}
          list={todayNotifications}
        />
      )}

      {lastWeekNotifications.length > 0 && (
        <NotificationsGroup
          title={t("notifications_timeStamps.lastWeek")}
          list={lastWeekNotifications}
        />
      )}

      {lastMonthNotifications.length > 0 && (
        <NotificationsGroup
          title={t("notifications_timeStamps.lastMonth")}
          list={lastMonthNotifications}
        />
      )}

      {olderNotifications.length > 0 && (
        <NotificationsGroup
          title={t("notifications_timeStamps.older")}
          list={olderNotifications}
        />
      )}
    </div>
  );
};

export default NotificationList;
