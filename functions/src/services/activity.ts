import { EmailDynamicDataType, EmailType } from "../types/pubsub";
import { firestore } from "./firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "./sendgrid";
import { logError, logInfo } from "./logging";

export const updateLastActive = async (uid: string): Promise<boolean> => {
  const userRef = firestore.collection("users").doc(uid);

  try {
    await userRef.update({
      lastActive: FieldValue.serverTimestamp(),
    });
    return true;
  } catch (error) {
    throw new Error("Failed to update last active timestamp");
  }
};

const initializeNotifiedField = async () => {
  try {
    const userRef = firestore.collection("users");

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6);

    const usersSnapshot = await userRef
      .where("role", "==", "creator")
      .where("lastActive", "<", cutoffDate)
      .get();

    if (usersSnapshot.empty) {
      return;
    }

    const batch = firestore.batch();

    usersSnapshot.forEach((doc) => {
      const userDoc = doc.data();
      if (!("notified" in userDoc)) {
        batch.update(doc.ref, { notified: false });
      }
    });
    await batch.commit();
  } catch (error) {
    console.error("Failed to initialize 'notified' field:", error);
  }
};

export const getInactiveUsers = async (months: number) => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  try {
    await initializeNotifiedField();
    const userRef = firestore.collection("users");
    const query = await userRef
      .where("lastActive", "<", cutoffDate)
      .where("notified", "==", false)
      .get();

    if (query.empty) {
      return [];
    }

    const inactiveUsers = query.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return inactiveUsers;
  } catch (error) {
    throw new Error("Failed to fetch inactive users.");
  }
};

export const markUserNotified = async (userId: string) => {
  try {
    await firestore.collection("users").doc(userId).update({
      notified: true,
      notifiedAt: new Date(),
    });
  } catch (error) {
    throw new Error("Failed to mark user as notified.");
  }
};

export const sendInactivityEmail = async (
  uid: string,
  emailData: EmailDynamicDataType
) => {
  return sendEmail({
    userId: uid,
    data: {
      ...emailData,
    },
  });
};

export const sendCloserToAccountDeletionEmail = async (uid: string) => {
  const emailData: EmailDynamicDataType = {
    type: EmailType.ACCOUNT_CLOSE_TO_DELETION,
    helpCenterUrl: "",
  };

  return sendEmail({
    userId: uid,
    data: {
      ...emailData,
    },
  });
};

export const getRenotifyUsers = async (
  months: number,
  daysSinceLastNotification: number
) => {
  const userRef = firestore.collection("users");
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  const notificationCutoffDate = new Date(
    Date.now() - daysSinceLastNotification * 24 * 60 * 60 * 1000
  );

  try {
    const notifiedQuery = await userRef
      .where("lastActive", "<", cutoffDate)
      .where("notified", "==", true)
      .where("notifiedAt", "<=", notificationCutoffDate)
      .get();

    if (notifiedQuery.empty) {
      logInfo(`No users to re-notify for ${daysSinceLastNotification} days.`);
      return [];
    } else {
      const reNotifyUsers = notifiedQuery.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return reNotifyUsers;
    }
  } catch (error) {
    logError("Error fetching re-notify users:", error);
    throw new Error("Failed to fetch users for re-notification.");
  }
};
