import { sendOtp } from "./sendOtp";
import { verifyOtpAndGenerateToken } from "./verifyOtpAndGenerateToken";
import { validatePrimaryEmail } from "./validatePrimaryEmail";
import { sendAuthRecoveryOtp } from "./sendAuthRecoveryOtp";
import { verifyAuthRecoveryOtp } from "./verifyAuthRecoveryOtp";

export const auth = {
  sendOtp,
  verifyOtpAndGenerateToken,
  validatePrimaryEmail,
  sendAuthRecoveryOtp,
  verifyAuthRecoveryOtp,
};
