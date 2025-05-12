import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "@/lib/utils";
import { Error } from "@/components/ui/error";
import { useToast } from "@/components/ui/use-toast";
import { VerificationContext } from "../../types";

interface VerificationFormProps {
  onComplete: (otp: string) => void;
  isError: boolean;
  recipient: string;
  isVerifying?: boolean; // Disables the input field when true
  context?: VerificationContext;
}

const TIMEOUT_DURATION = 30; // Initial duration for the timer

export const VerificationForm = ({
  onComplete,
  isError,
  recipient,
  isVerifying = false,
  context = VerificationContext.SIGN_IN,
}: VerificationFormProps) => {
  const { t } = useTranslation();
  const { resendOtp } = useAuth();
  const { toast } = useToast();

  const [timer, setTimer] = useState(TIMEOUT_DURATION);
  const [isRateLimitExceeded, setIsRateLimitExceeded] = useState(false);

  useEffect(() => {
    const initializeTimer = () => {
      const savedTimestamp = localStorage.getItem("otp-timer");
      if (savedTimestamp) {
        const elapsedTime = Math.floor(
          (Date.now() - parseInt(savedTimestamp)) / 1000
        );
        if (elapsedTime >= TIMEOUT_DURATION) {
          localStorage.removeItem("otp-timer"); // Clear outdated timestamp
          setTimer(0); // Set timer to 0 as the period has expired
        } else {
          setTimer(TIMEOUT_DURATION - elapsedTime);
        }
      } else {
        localStorage.setItem("otp-timer", Date.now().toString());
        setTimer(TIMEOUT_DURATION);
      }

      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          if (newTime > 0) {
            return newTime;
          } else {
            clearInterval(interval); // Stop the timer when it reaches 0
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    };

    return initializeTimer(); // Call the function to setup the timer
  }, [timer]);

  const handleSendAgain = useCallback(async () => {
    if (isRateLimitExceeded) return;

    const isSent = await resendOtp(recipient, context);

    setTimer(TIMEOUT_DURATION);
    localStorage.setItem("otp-timer", Date.now().toString());

    if (isSent === true) {
      toast({
        variant: "success",
        text: t("verificationForm_toast_codeResent"),
      });
    } else {
      setIsRateLimitExceeded(true);
      localStorage.removeItem("otp-timer");
    }
  }, [isRateLimitExceeded, resendOtp, recipient, context, toast, t]);

  return (
    <div className="md:mt-0.5 flex flex-col items-center">
      <div className={cn("flex flex-col items-center gap-y-3 pb-8 md:pb-9")}>
        <OtpInput
          onComplete={onComplete}
          hasError={isError}
          isDisabled={isVerifying}
        />
        {isError && (
          <Error className="flex items-center justify-center gap-1">
            <img src="/icon/info.svg" alt="info" />
            {t("verificationForm_error")}
          </Error>
        )}
      </div>
      <Button
        variant="link"
        disabled={isRateLimitExceeded || timer > 0}
        onClick={handleSendAgain}
        className={cn(
          "h-auto !p-0 text-dark-T80",
          "disabled:cursor-not-allowed disabled:opacity-100",
          isRateLimitExceeded ? "text-primaryBlue" : "disabled:text-mediumBlue"
        )}
        loading={isVerifying}
      >
        {isRateLimitExceeded
          ? t("verificationForm_button_sendAgain")
          : t(
            timer > 0
              ? "verificationForm_button_sendAgain_with_time"
              : "verificationForm_button_sendAgain",
            {
              time: timer,
            }
          )}
      </Button>
      {isRateLimitExceeded && (
        <div className="mt-4 p-3 pr-4 gap-x-2 flex items-start rounded-xxl bg-red-t10 backdrop-blur-5">
          <img src="/icon/info-filled.svg" alt="info" />
          <p className="font-semibold text-dark-T80 text-sm/4.5 -tracking-[0.14px] ">
            {t("verificationForm_error_requestLimit")}
          </p>
        </div>
      )}
    </div>
  );
};
