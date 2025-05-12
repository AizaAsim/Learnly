import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Notification } from "@/features/Notifications/types";
import { firestore } from "@/services/firebase";
import {
  addNotification,
  clearNotifications,
  editNotification,
  removeNotification,
} from "@/store/reducers/notificationReducer";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function NotificationListener() {
  const { user, isLoggedIn } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.uid) return;
    // TODO: Add pagination logic
    const notificationsRef = collection(
      firestore,
      "users",
      user.uid,
      "notifications"
    );
    const notificationsQuery = query(
      notificationsRef,
      where("clearAt", "==", null)
    );
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const notification = change.doc.data() as Notification;

        switch (change.type) {
          case "added":
            dispatch(addNotification(notification));
            break;
          case "modified":
            dispatch(editNotification(notification));
            break;
          case "removed":
            dispatch(removeNotification(notification));
            break;
        }
      });
    });

    // Clean up the listener when the component unmounts or the user changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid, isLoggedIn, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(clearNotifications());
    }
  }, [isLoggedIn, dispatch]);

  // Logical components don't render anything
  return null;
}
