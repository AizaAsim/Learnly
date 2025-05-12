import { useAuth } from "@/features/Auth/hooks/useAuth";
import { logError } from "@/services/logging";
import { useCallback } from "react";
import {
  clearAllNotifications,
  clearNotification,
  markNotificationAsRead,
} from "../services/notificationFirstore";

export const useNotificationActions = () => {
  const { user } = useAuth();

  const handleClear = useCallback(
    async (notificationId: string) => {
      if (!user?.uid) return;

      try {
        await clearNotification(user.uid, notificationId);
      } catch (error) {
        logError("Error clearing all notification:", error);
      }
    },
    [user?.uid]
  );

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      if (!user?.uid) return;

      try {
        await markNotificationAsRead(user.uid, notificationId);
      } catch (error) {
        logError("Error marking notification as read:", error);
      }
    },
    [user?.uid]
  );

  const handleClearAll = useCallback(async () => {
    if (!user?.uid) return;

    try {
      await clearAllNotifications(user.uid);
    } catch (error) {
      logError("Error clearing all notifications:", error);
    }
  }, [user?.uid]);

  return { handleClear, handleMarkAsRead, handleClearAll };
};
