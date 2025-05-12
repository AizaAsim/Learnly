import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut as logOut,
  User,
  verifyBeforeUpdateEmail,
  sendEmailVerification,
  signInWithCustomToken,
  updateEmail,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
import { UserContext } from "../contexts/UserContext";
import {
  NotificationSettings,
  RecoveryMethod,
  RecoveryMethods,
  Role,
  Roles,
  UserNotificationSettings,
  VerificationContext,
} from "../types";
import { FirebaseError } from "firebase/app";
import { logError } from "@/services/logging";
import {
  sendAuthRecoveryOtp,
  sendOtp,
  validatePrimaryEmail,
  verifyAuthRecoveryOtp,
  verifyOtpAndGenerateToken,
} from "../services/callable";
import {
  sendCurrentEmailOtp,
  sendNewEmailOtp,
  sendRecoveryOtp,
  verifyRecoveryOtp,
  verifyUpdateEmailOtp,
} from "@/features/Settings/services/callable";

const reservedRouteNames = [
  "home",
  "notifications",
  "add-a-reel",
  "subscriptions",
  "subscribers",
  "blocked",
  "search",
  "profile",
  "my-profile",
  "settings",
  "insights",
  "checkout",
  "auth",
  "terms",
];

const isUsernameValid = (username: string) => {
  return !reservedRouteNames.includes(username.toLowerCase());
};

export function useAuth() {
  // ** State
  const [isLoading, setIsLoading] = useState(true);

  // ** Context
  const context = useContext(UserContext);

  // ** Hooks
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const initialNotificationSettings = useMemo(
    () => ({
      user: {
        productsUpdates: true,
        newsletters: true,
        newPosts: true,
        creatorUpdates: true,
      },
      creator: {
        newSubscribers: true,
      },
    }),
    []
  );

  // ** Callbacks
  const setSettings = useCallback(
    async (
      user: User,
      role: Roles,
      notificationSettings?: NotificationSettings
    ) => {
      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userSettingsDocRef = doc(userDocRef, "settings", "notifications");
        const defaultSettings =
          role === Roles.CREATOR
            ? initialNotificationSettings.creator
            : initialNotificationSettings.user;

        await setDoc(
          userSettingsDocRef,
          notificationSettings || defaultSettings,
          { merge: true }
        );
      } catch (error) {
        logError(error);
      }
    },
    [initialNotificationSettings]
  );

  const createUserDoc = useCallback(async (user: User, role: Role) => {
    try {
      const userDocRef = doc(firestore, "users", user.uid);
      const { displayName: name, email } = user;

      const userData = {
        id: user.uid,
        role,
        ...(name && { name }), // Only add the name field if it exists
        deletedAt: null,
      };

      await setDoc(userDocRef, userData);

      const userPrivateDocRef = doc(userDocRef, "private", "info");

      const effectiveEmail =
        email || user.providerData.find((pd) => pd.email)?.email;

      if (effectiveEmail) {
        await setDoc(userPrivateDocRef, { email: effectiveEmail });
      }
    } catch (error) {
      logError(error);
    }
  }, []);

  const customTokenSignIn = useCallback(
    async (email: string, token: string) => {
      try {
        setIsLoading(true);

        const { user } = await signInWithCustomToken(auth, token);

        const result = await user?.getIdTokenResult();

        // Check if the user is signing in from a recovery method
        // The `isRecovered` claim indicates whether the user is signing in from a recovery method
        // If the user is signing in from a recovery method, we set a flag in localStorage to indicate that the user has recovered their account
        if (result?.claims.isRecovered) {
          localStorage.setItem("isRecovered", "true");
        }

        // Check if the user is new and their email is not set.
        // The `isNewUser` claim indicates whether the user has just signed up via the custom token flow.
        // Additionally, we check `!user.email` as createCustomToken leaves the email field empty for new entries.
        // This ensures we only update the email if it's missing, preventing unnecessary updates for existing users
        if (!user.email && result?.claims.isNewUser) {
          // Assign user email
          await updateEmail(user, email);

          // Create a user document in Firestore to tag the user with a role
          await createUserDoc(user, result?.claims.role as Role);
        }
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context, createUserDoc]
  );

  const sendAuthOtp = useCallback(
    async (email: string) => {
      try {
        setIsLoading(true);

        const result = await sendOtp({ email });

        return result.data.success;
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const verifyAuthOtp = useCallback(
    async (email: string, otp: string, role: Role) => {
      try {
        setIsLoading(true);

        const result = await verifyOtpAndGenerateToken({ email, otp, role });

        const { token } = result.data;

        await customTokenSignIn(email, token);

        localStorage.removeItem("otp-timer");
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [context, customTokenSignIn]
  );

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await logOut(auth);
    } catch (e) {
      logError(e);
      context?.setError((e as FirebaseError).message);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, context]);

  const signInWithGoogle = useCallback(
    async (role?: Role) => {
      if (role) {
        localStorage.setItem("role", role);
      }
      try {
        setIsLoading(true);
        await signInWithRedirect(auth, new GoogleAuthProvider());
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, context]
  );

  const deleteAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }
    } catch (e) {
      logError(e);
      context?.setError((e as FirebaseError).message);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, context]);

  const checkUsernameUniqueness = useCallback(
    async (username: string) => {
      try {
        setIsLoading(true);
        const usersRef = collection(firestore, "users");
        const q = query(
          usersRef,
          where("username", "==", username.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const updateUserNames = useCallback(
    async (names: { displayName?: string; username?: string }) => {
      try {
        setIsLoading(true);
        const userDocRef = doc(firestore, "users", auth.currentUser!.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          if (names.username) {
            // Validate Username
            if (!isUsernameValid(names.username)) {
              context?.setError("Username is unavailable");
              return; // Since username is not valid
            }

            const usernameQuery = query(
              collection(firestore, "users"),
              where("username", "==", names.username)
            );
            const usernameQuerySnap = await getDocs(usernameQuery);

            if (!usernameQuerySnap.empty) {
              // Username already exists
              context?.setError("Username is unavailable");
              return; // Since username is taken
            }
          }
          await setDoc(userDocRef, names, { merge: true });
        }
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context, setIsLoading]
  );

  const sendEmailVerificationEmail = useCallback(
    async (newEmail: string) => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          await verifyBeforeUpdateEmail(currentUser, newEmail);
        }
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context, setIsLoading]
  );

  const sendVerificationEmail = useCallback(async () => {
    setIsLoading(true);
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => context?.setError(""), [context]);

  const getNotificationSettings =
    useCallback(async (): Promise<UserNotificationSettings | null> => {
      try {
        if (!context?.user?.uid) {
          return null;
        }
        const userDocRef = doc(firestore, "users", context?.user?.uid);
        const userNotificationSettingsDocRef = doc(
          userDocRef,
          "settings",
          "notifications"
        );
        const userNotificationSettings = await getDoc(
          userNotificationSettingsDocRef
        );
        return userNotificationSettings.data() as UserNotificationSettings;
      } catch (error) {
        logError(error);
        return null;
      }
    }, [context?.user]);

  const sendOtpToCurrentEmail = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const { data } = await sendCurrentEmailOtp();

        return { isValid: data.success };
      }
    } catch (e) {
      logError(e);
      context?.setError((e as FirebaseError).message);
    } finally {
      setIsLoading(false);
    }
  }, [context, setIsLoading]);

  const sendOtpToNewEmail = useCallback(
    async (email: string) => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          const { data } = await sendNewEmailOtp({ email });
          if (!data.isValid) {
            context?.setError(data.message);
          }
          return { isValid: data.isValid };
        }
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context, setIsLoading]
  );

  const verifyOtpForUpdateEmail = useCallback(
    async (email: string, otp: string) => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          const result = await verifyUpdateEmailOtp({ email, otp });
          if (result.data.isVerified) localStorage.removeItem("otp-timer");

          return { isVerified: result.data.isVerified };
        }
      } catch (e) {
        logError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading]
  );

  const sendRecoveryMethodOtp = useCallback(
    async (recoveryMethod: RecoveryMethod, value: string) => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          const { data } = await sendRecoveryOtp({ recoveryMethod, value });
          return { isValid: data.isValid };
        }
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const verifyRecoveryMethodOtp = useCallback(
    async (recoveryMethod: RecoveryMethod, value: string, otp: string) => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          const { data } = await verifyRecoveryOtp({
            recoveryMethod,
            value,
            otp,
          });
          return { isVerified: data.isVerified };
        }
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const validateAssociatedAccount = useCallback(
    async (email: string) => {
      try {
        setIsLoading(true);

        const { data } = await validatePrimaryEmail({ email });
        return {
          ...data,
        };
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const sendRecoveryAuthOtp = useCallback(
    async (
      primaryEmail: string,
      recoveryMethod: RecoveryMethod,
      value?: string
    ) => {
      try {
        setIsLoading(true);
        const { data } = await sendAuthRecoveryOtp({
          value,
          recoveryMethod,
          primaryEmail,
        });

        return { isValid: data?.isValid, recipient: data?.recipient };
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const verifyRecoveryAuthOtp = useCallback(
    async (
      recoveryMethod: RecoveryMethod,
      value: string,
      otp: string,
      primaryEmail: string
    ) => {
      try {
        setIsLoading(true);
        const { data } = await verifyAuthRecoveryOtp({
          recoveryMethod,
          value,
          otp,
          primaryEmail,
        });

        if (data.isVerified) {
          await customTokenSignIn(primaryEmail, data.token);
        }

        return { isVerified: data.isVerified };
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [context, customTokenSignIn]
  );

  const resendOtp = useCallback(
    async (
      recipient: string,
      method: VerificationContext,
      primaryEmail?: string
    ) => {
      try {
        setIsLoading(true);

        let isSent;
        let currentEmailOtp;
        let newEmailOtp;
        let recoveryEmailOtp;
        let recoveryPhoneOtp;
        let accountRecoveryEmailOtp;
        let accountRecoveryPhoneOtp;

        switch (method) {
          case VerificationContext.SIGN_IN:
            isSent = await sendAuthOtp(recipient);
            break;

          case VerificationContext.CURRENT_EMAIL:
            currentEmailOtp = await sendOtpToCurrentEmail();
            isSent = currentEmailOtp?.isValid ? true : false;
            break;

          case VerificationContext.NEW_EMAIL:
            newEmailOtp = await sendOtpToNewEmail(recipient);
            isSent = newEmailOtp?.isValid ? true : false;
            break;

          case VerificationContext.RECOVERY_EMAIL:
            recoveryEmailOtp = await sendRecoveryMethodOtp(
              RecoveryMethods.EMAIL,
              recipient
            );
            isSent = recoveryEmailOtp?.isValid ? true : false;
            break;

          case VerificationContext.RECOVERY_PHONE:
            recoveryPhoneOtp = await sendRecoveryMethodOtp(
              RecoveryMethods.PHONE,
              recipient
            );
            isSent = recoveryPhoneOtp?.isValid ? true : false;
            break;

          case VerificationContext.ACCOUNT_RECOVERY_EMAIL:
            accountRecoveryEmailOtp = await sendRecoveryAuthOtp(
              primaryEmail!,
              RecoveryMethods.EMAIL
            );
            isSent = accountRecoveryEmailOtp?.isValid ? true : false;
            break;

          case VerificationContext.ACCOUNT_RECOVERY_PHONE:
            accountRecoveryPhoneOtp = await sendRecoveryAuthOtp(
              primaryEmail!,
              RecoveryMethods.PHONE,
              recipient
            );
            isSent = accountRecoveryPhoneOtp?.isValid ? true : false;
            break;

          default:
            break;
        }

        return isSent ? true : false;
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      context,
      sendAuthOtp,
      sendOtpToCurrentEmail,
      sendOtpToNewEmail,
      sendRecoveryAuthOtp,
      sendRecoveryMethodOtp,
    ]
  );

  return {
    user: context?.user,
    isAuthLoading: context?.isAuthLoading,
    isLoading,
    isLoggedIn: !!context?.user && !isLoading && context.user?.role,
    currentRole: context?.user?.role as Role,
    error: context?.error,
    clearError,
    hasError: !!context?.error,
    sendAuthOtp,
    resendOtp,
    verifyAuthOtp,
    signOut,
    signInWithGoogle,
    deleteAccount,
    updateUserNames,
    sendEmailVerificationEmail,
    createUserDoc,
    setSettings,
    getNotificationSettings,
    sendVerificationEmail,
    sendOtpToCurrentEmail,
    sendOtpToNewEmail,
    verifyOtpForUpdateEmail,
    checkUsernameUniqueness,
    sendRecoveryMethodOtp,
    verifyRecoveryMethodOtp,
    validateAssociatedAccount,
    sendRecoveryAuthOtp,
    verifyRecoveryAuthOtp,
  };
}
