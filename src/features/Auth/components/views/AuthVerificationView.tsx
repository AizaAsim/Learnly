import { useCallback, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Roles } from "../../types";
import { VerificationForm } from "../forms/VerificationForm";
import { useAuthModals } from "../../hooks/useAuthModals";

export const AuthVerificationView = ({ email }: { email: string }) => {
  const { isLoading, verifyAuthOtp } = useAuth();
  const { openNameModal } = useAuthModals();

  const [isError, setIsError] = useState(false);

  const handleOtpOnComplete = useCallback(
    async (otp: string) => {
      try {
        await verifyAuthOtp(email, otp, Roles.USER);
        openNameModal();
      } catch (e) {
        setIsError(true);
      }
    },
    [verifyAuthOtp, email, openNameModal]
  );

  return (
    <div className="w-full bg-white flex flex-col items-center">
      <VerificationForm
        onComplete={handleOtpOnComplete}
        isError={isError}
        recipient={email}
        isVerifying={isLoading}
      />
    </div>
  );
};
