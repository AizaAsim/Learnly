import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { auth, firestore } from "../../services/firebaseAdmin";
import { logInfo, logWarning, logError } from "../../services/logging";
import { Timestamp } from "firebase-admin/firestore";
import { ZodError } from "zod";
import { UserRootSchema } from "../../shared/schemas/users";
import { formatZodError } from "../../shared/helpers/zodHelpers";
import { saveUserLatestAgreement } from "../../services/termsOfService";
import { Roles } from "../../types/roles";
import { sendNotification } from "../../services/notifications";
import {
  InAppNotificationIconType,
  InAppNotificationType,
} from "../../types/pubsub";
import { v4 as uuidv4 } from "uuid";

// Initial notification settings configuration
const initialNotificationSettings = {
  user: {
    productsUpdates: true,
    newsletters: true,
    newPosts: true,
    creatorUpdates: true,
  },
  creator: {
    newSubscribers: true,
  },
};

export const userCreated = onDocumentCreated("users/{docId}", async (event) => {
  const snapshot = event.data;
  const userId = event.params.docId;
  if (!snapshot) {
    logWarning("No data associated with the event", event);
    return;
  }
  const user = snapshot.data();
  try {
    // We need to be notified when someone is trying to set an admin role
    // so we're gonna get the data and check it before we parse it
    if (user.role === "admin") {
      logWarning(
        "Attempted to set admin role via registration",
        event,
        snapshot
      );
      // Throw an error to stop the function and trigger the catch block
      throw new Error("Invalid user role");
    }

    // finally, we parse the data
    UserRootSchema.parse(user);
  } catch (error) {
    const message =
      error instanceof ZodError
        ? formatZodError(error) // Array-to-string conversion of errors
        : "User data does not match the schema.";
    logError(message, event, snapshot);
    throw new Error(message);
  }

  // This is non-critical, so we don't want to stop the function if it fails
  try {
    await saveUserLatestAgreement(userId);
  } catch (err) {
    logError("Error setting user agreement.", event, err);
  }

  const now = Timestamp.now();

  try {
    // Add a custom claim to the user to flag its account type
    await auth.setCustomUserClaims(userId, {
      role: user.role,
    });

    // Add isBlocked flag to the user
    await firestore
      .collection("users")
      .doc(userId)
      .set({ isBlocked: false }, { merge: true });

    // Flag the claims update to react to it in the client
    await firestore
      .collection("users")
      .doc(userId)
      .collection("private")
      .doc("info")
      .set({ claimsLastUpdated: now }, { merge: true });

    logInfo("Custom claims set for user.", {
      userId,
      role: user.role,
      timestamp: now,
    });
  } catch (error) {
    const message = "Error setting custom claims.";
    logError(message, event, error);
    throw new Error(message);
  }

  // Initialize notification settings
  try {
    const userSettingsDocRef = firestore
      .collection("users")
      .doc(userId)
      .collection("settings")
      .doc("notifications");

    const defaultSettings =
      user.role === Roles.CREATOR
        ? initialNotificationSettings.creator
        : initialNotificationSettings.user;

    await userSettingsDocRef.set(defaultSettings, { merge: true });

    logInfo("Notification settings initialized for user.", {
      userId,
      role: user.role,
      settings: defaultSettings,
    });
  } catch (error) {
    logError("Error initializing notification settings.", event, error);
    // Don't throw here to allow the function to continue
  }

  // Send a notification to the user
  try {
    const notificationData = {
      title: "Welcome to the app!",
      message: `Your${
        user.role === Roles.CREATOR ? "Educator" : " "
      }account has been created successfully!`,
      type: InAppNotificationType.CREATOR_NEW_ACCOUNT,
      iconType: InAppNotificationIconType.STATIC,
    };
    const notification = {
      to: userId,
      data: notificationData,
    };
    await sendNotification(notification);
  } catch (error) {
    logError("Error sending welcome notification.", event, error);
  }

  // Link a silent email/password account for SSO Account.
  try {
    const userRecord = await auth.getUser(userId);
    const providerData = userRecord.providerData;

    // Find if user logged in via Google or Apple
    const ssoProvider = providerData.find(
      (p) => p.providerId === "google.com" || p.providerId === "apple.com"
    );

    if (ssoProvider && ssoProvider.email) {
      logInfo({ message: "USER LOGGED IN VIA SSO" });
      const email = ssoProvider.email;
      const password = uuidv4();

      // Check if user already has a password account linked
      if (!providerData.some((p) => p.providerId === "password")) {
        await auth.updateUser(userId, { email, password });

        logInfo("Silent email/password account created and linked", {
          userId,
        });
      }
    }
  } catch (error) {
    logError("Error creating silent email/password account.", event, error);
  }
});
