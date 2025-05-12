import { fetchRecoveryMethods } from "./fetchRecoveryMethods";
import { sendRecoveryOtp } from "./sendRecoveryOtp";
import { verifyRecoveryOtp } from "./verifyRecoveryOtp";

export const recovery = {
  sendRecoveryOtp,
  verifyRecoveryOtp,
  fetchRecoveryMethods,
};
