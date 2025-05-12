import { AuthTitle } from "@/components/layout/AuthTitle";
import { Trans, useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { RecoveryMethods, VerificationContext } from "@/features/Auth/types";
import { VerificationForm } from "@/features/Auth/components/forms/VerificationForm";
import { formatPhoneNumber } from "@/lib/utils";

const AccountRecoveryVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoading, verifyRecoveryAuthOtp } = useAuth();
  const recoveryMethod = location.state?.recoveryMethod;
  const value = location.state?.value;
  const primaryEmail = location.state?.primaryEmail;
  const displayValue = location.state?.displayValue;

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!value || !recoveryMethod) {
      navigate("/auth");
    }
  }, [value, recoveryMethod, navigate]);

  const handleOtpOnComplete = useCallback(
    async (otp: string) => {
      try {
        const result = await verifyRecoveryAuthOtp(
          recoveryMethod,
          value,
          otp,
          primaryEmail
        );
        if (!result?.isVerified) {
          setIsError(true);
        }
      } catch (e) {
        setIsError(true);
      }
    },
    [primaryEmail, recoveryMethod, value, verifyRecoveryAuthOtp]
  );

  if (!recoveryMethod || !value) return null;

  return (
    <div className="bg-white flex flex-col items-center">
      <AuthTitle
        title={t("accountRecovery_title")}
        description={
          <Trans
            i18nKey={"accountRecovery_description_verify"}
            components={{
              strong: (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden font-semibold" />
              ),
            }}
            values={{
              value:
                recoveryMethod === RecoveryMethods.EMAIL
                  ? displayValue
                  : formatPhoneNumber(displayValue),
            }}
          />
        }
      />
      <VerificationForm
        onComplete={handleOtpOnComplete}
        isError={isError}
        recipient={value}
        isVerifying={isLoading}
        context={
          recoveryMethod === RecoveryMethods.EMAIL
            ? VerificationContext.ACCOUNT_RECOVERY_EMAIL
            : VerificationContext.ACCOUNT_RECOVERY_PHONE
        }
      />
    </div>
  );
};

export default AccountRecoveryVerificationPage;
