import { useAuth } from "@/features/Auth/hooks/useAuth.tsx";
import { useModal } from "@/hooks/useModal.tsx";
import { useCallback, useState } from "react";
import { VerificationForm } from "@/features/Auth/components/forms/VerificationForm";
import { useUpdateEmailModals } from "../hooks/useUpdateEmailModals";
import { VerificationContext } from "@/features/Auth/types";

type OtpVerificationModalProps = {
  email: string;
  hasSetNewEmail?: boolean;
};

export function OtpVerificationModal({
  email,
  hasSetNewEmail = false,
}: OtpVerificationModalProps) {
  const { closeModal } = useModal();
  const { isLoading, verifyOtpForUpdateEmail } = useAuth();
  const { openNewEmailModal } = useUpdateEmailModals();
  const [isError, setIsError] = useState(false);

  const handleOtpOnComplete = useCallback(
    async (otp: string) => {
      if (!email) return;
      const result = await verifyOtpForUpdateEmail(email, otp);
      if (hasSetNewEmail) {
        if (result?.isVerified) {
          localStorage.setItem("isEmailUpdated", JSON.stringify(true));
          closeModal();
          window.location.href = "/settings";
        }
        setIsError(result?.isVerified ? false : true);
      } else {
        if (result?.isVerified) openNewEmailModal();
        setIsError(result?.isVerified ? false : true);
      }
    },
    [
      hasSetNewEmail,
      email,
      verifyOtpForUpdateEmail,
      closeModal,
      openNewEmailModal,
    ]
  );

  return (
    <div className="w-full flex flex-col items-center text-center">
      <VerificationForm
        onComplete={handleOtpOnComplete}
        isError={isError}
        recipient={email}
        isVerifying={isLoading}
        context={
          hasSetNewEmail
            ? VerificationContext.NEW_EMAIL
            : VerificationContext.CURRENT_EMAIL
        }
      />
    </div>
  );
}
