import { createSelector } from "@reduxjs/toolkit";
import { convertToDate, getDateDaysAgo } from "@/lib/utils";
import { isAfter, isBefore, startOfToday, subMinutes } from "date-fns";
import { withNotificationsSlice } from "../reducers/notificationReducer";

const selectNotificationSlice = withNotificationsSlice.selector((state) => state.notifications);

export const notifications = createSelector(
  selectNotificationSlice,
  ({ notifications }) => {
    return [...notifications].sort((a, b) => {
      const dateA = convertToDate(a.sentAt);
      const dateB = convertToDate(b.sentAt);
      return dateB.getTime() - dateA.getTime(); // Sort in descending order (newest first)
    });
  }
);

export const notificationsCountSelector = createSelector(
  [notifications],
  (notifications) => notifications.length
);

export const hasUnreadNotificationsSelector = createSelector(
  [notifications],
  (notifications) => {
    return notifications.some((notification) => !notification.readAt);
  }
);

// Notifications are considered new if they are not read or read within the last `extendedMinutes` minutes
const extendedMinutes = 10;
const readAtExtension = subMinutes(new Date(), extendedMinutes);

export const newNotificationsSelector = createSelector(
  [notifications],
  (notifications) => {
    return notifications.filter(
      (notification) =>
        !notification.readAt ||
        isAfter(notification.readAt.toDate(), readAtExtension)
    );
  }
);

export const todayNotificationsSelector = createSelector(
  [notifications, newNotificationsSelector],
  (notifications, newNotifications) => {
    const todayMidNight = startOfToday();
    return notifications.filter(
      (notification) =>
        // Filter out the new notifications that has been classified as new
        !newNotifications.includes(notification) &&
        convertToDate(notification?.sentAt) >= todayMidNight &&
        notification.readAt &&
        isBefore(notification.readAt.toDate(), readAtExtension)
    );
  }
);

export const lastWeekNotificationsSelector = createSelector(
  [notifications, newNotificationsSelector],
  (notifications, newNotifications) => {
    const todayMidNight = startOfToday();
    const lastWeek = getDateDaysAgo(7);
    return notifications.filter((notification) => {
      const sentDate = convertToDate(notification?.sentAt);
      return (
        // Filter out the notifications that has been classified as new
        !newNotifications.includes(notification) &&
        sentDate >= lastWeek &&
        sentDate < todayMidNight &&
        notification.readAt
      );
    });
  }
);

export const lastMonthNotificationsSelector = createSelector(
  [notifications, newNotificationsSelector],
  (notifications, newNotifications) => {
    const lastWeek = getDateDaysAgo(7);
    const lastMonth = getDateDaysAgo(30);
    return notifications.filter((notification) => {
      const sentDate = convertToDate(notification?.sentAt);
      return (
        // Filter out the notifications that has been classified as new
        !newNotifications.includes(notification) &&
        sentDate >= lastMonth &&
        sentDate < lastWeek &&
        notification.readAt
      );
    });
  }
);

export const olderNotificationsSelector = createSelector(
  [notifications, newNotificationsSelector],
  (notifications, newNotifications) => {
    const lastMonth = getDateDaysAgo(30);
    return notifications.filter(
      (notification) =>
        // Filter out the notifications that has been classified as new
        !newNotifications.includes(notification) &&
        convertToDate(notification?.sentAt) < lastMonth &&
        notification.readAt
    );
  }
);
