import { functions } from "@/services/firebase";
import { httpsCallable } from "firebase/functions";

import { RecoveryMethod, Role } from "../types";

export const sendOtp = httpsCallable<
  { email: string },
  { success: boolean; message: string }
>(functions, "auth-sendOtp");

export const verifyOtpAndGenerateToken = httpsCallable<
  { email: string; otp: string; role: Role },
  { token: string }
>(functions, "auth-verifyOtpAndGenerateToken");

export const validatePrimaryEmail = httpsCallable<
  { email: string },
  {
    isValid: boolean;
    recovery: { phone: string | null; email: string | null };
  }
>(functions, "auth-validatePrimaryEmail");

export const sendAuthRecoveryOtp = httpsCallable<
  { recoveryMethod: RecoveryMethod; primaryEmail: string; value?: string },
  { isValid: boolean; message: string; recipient: string }
>(functions, "auth-sendAuthRecoveryOtp");

export const verifyAuthRecoveryOtp = httpsCallable<
  {
    recoveryMethod: RecoveryMethod;
    otp: string;
    value: string;
    primaryEmail: string;
  },
  { isVerified: boolean; token: string }
>(functions, "auth-verifyAuthRecoveryOtp");
