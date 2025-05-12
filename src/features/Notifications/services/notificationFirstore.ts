import { firestore } from "@/services/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export const clearNotification = async (
  userId: string,
  notificationId: string
) => {
  const notificationRef = doc(
    firestore,
    "users",
    userId,
    "notifications",
    notificationId
  );
  await updateDoc(notificationRef, { clearAt: Timestamp.now() });
};

export const markNotificationAsRead = async (
  userId: string,
  notificationId: string
) => {
  const notificationRef = doc(
    firestore,
    "users",
    userId,
    "notifications",
    notificationId
  );
  await updateDoc(notificationRef, {
    readAt: Timestamp.now(),
  });
};

export const clearAllNotifications = async (userId: string) => {
  const notificationsRef = collection(
    firestore,
    "users",
    userId,
    "notifications"
  );
  const q = query(notificationsRef, where("clearAt", "==", null));
  const querySnapshot = await getDocs(q);

  const batch = writeBatch(firestore);
  const now = Timestamp.now();

  querySnapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      clearAt: now,
    });
  });

  await batch.commit();
};
