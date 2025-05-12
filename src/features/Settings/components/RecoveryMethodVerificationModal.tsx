import { useModal } from "@/hooks/useModal.tsx";
import { useCallback, useState } from "react";
import { RecoveryMethod, RecoveryMethods } from "@/features/Auth/types";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { VerificationForm } from "@/features/Auth/components/forms/VerificationForm";
import { VerificationContext } from "../../Auth/types/index";

type RecoveryMethodVerificationModalProps = {
  recoveryMethod: RecoveryMethod;
  value: string;
};

export const RecoveryMethodVerificationModal = ({
  recoveryMethod,
  value,
}: RecoveryMethodVerificationModalProps) => {
  const { closeModal } = useModal();
  const { verifyRecoveryMethodOtp } = useAuth();
  const [isError, setIsError] = useState(false);
  const handleOtpOnComplete = useCallback(
    async (otp: string) => {
      const result = await verifyRecoveryMethodOtp(recoveryMethod, value, otp);
      if (result?.isVerified) {
        closeModal();
      }
      setIsError(result?.isVerified ? false : true);
    },
    [closeModal, recoveryMethod, value, verifyRecoveryMethodOtp]
  );
  return (
    <div className="w-full flex flex-col items-center text-center">
      <VerificationForm
        onComplete={handleOtpOnComplete}
        isError={isError}
        recipient={value}
        context={
          recoveryMethod === RecoveryMethods.EMAIL
            ? VerificationContext.RECOVERY_EMAIL
            : VerificationContext.RECOVERY_PHONE
        }
      />
    </div>
  );
};
