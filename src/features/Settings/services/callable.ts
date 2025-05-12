import { RecoveryMethod } from "@/features/Auth/types";
import { functions } from "@/services/firebase";
import { httpsCallable } from "firebase/functions";

export const updateUser = httpsCallable<
  {
    displayName: string;
    username: string;
    email: string;
    bio: string;
  },
  void
>(functions, "users-updateUser");

export const sendCurrentEmailOtp = httpsCallable<void, { success: boolean }>(
  functions,
  "email-sendCurrentEmailOtp"
);

export const sendNewEmailOtp = httpsCallable<
  { email: string },
  { isValid: boolean; message: string }
>(functions, "email-sendNewEmailOtp");

export const verifyUpdateEmailOtp = httpsCallable<
  { email: string; otp: string },
  { isVerified: boolean }
>(functions, "email-verifyUpdateEmailOtp");

export const sendRecoveryOtp = httpsCallable<
  { recoveryMethod: RecoveryMethod; value: string },
  { isValid: boolean; message: string }
>(functions, "recovery-sendRecoveryOtp");

export const verifyRecoveryOtp = httpsCallable<
  { recoveryMethod: RecoveryMethod; value: string; otp: string },
  { isVerified: boolean; message: string }
>(functions, "recovery-verifyRecoveryOtp");

export const fetchRecoveryMethods = httpsCallable<
  void,
  { recoveryEmail: string | null; recoveryPhone: string | null }
>(functions, "recovery-fetchRecoveryMethods");
