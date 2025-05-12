import { AuthTitle } from "@/components/layout/AuthTitle";
import { VerificationForm } from "@/features/Auth/components/forms/VerificationForm";
import { Trans, useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AuthVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoading, verifyAuthOtp } = useAuth();
  const { email, role } = location.state;

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);

  const handleOtpOnComplete = useCallback(
    async (otp: string) => {
      setIsError(false);
      try {
        await verifyAuthOtp(email, otp, role);
      } catch (e) {
        setIsError(true);
      }
    },
    [verifyAuthOtp, email, role]
  );

  const handleRecoverYourAccount = useCallback(() => {
    localStorage.removeItem("otp-timer");
    navigate("/auth/account-recovery");
  }, [navigate]);

  if (!email) return null;

  return (
    <div className="bg-white flex flex-col items-center">
      <AuthTitle
        title={t("authVerificationPage_title")}
        description={
          <Trans
            i18nKey={"authVerificationPage_description"}
            components={{
              strong: <span className="font-semibold text-primaryBlue" />,
            }}
            values={{ email }}
            className="text-lightBlue/10"
          />
        }
      />

      <VerificationForm
        onComplete={handleOtpOnComplete}
        isError={isError}
        recipient={email}
        isVerifying={isLoading}
      />

      <div className="fixed bottom-0 inset-x-0 md:inset-x-auto flex justify-center items-center py-5 md:py-6 px-6">
        <Button
          variant="link"
          onClick={handleRecoverYourAccount}
          className="text-primaryBlue font-semibold !text-[15px]/5 -tracking-[0.225px] cursor-pointer !p-0 h-auto"
        >
          {t("authPage_button_recoverYourAccount")}
        </Button>
      </div>
    </div>
  );
};

export default AuthVerificationPage;
