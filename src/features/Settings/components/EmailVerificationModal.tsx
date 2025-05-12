import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/Auth/hooks/useAuth.tsx";
import { useModal } from "@/hooks/useModal.tsx";
import { logError } from "@/services/logging.ts";
import { useCallback, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

type EmailVerificationModalProps =
  | { newEmail: string; email?: never }
  | { newEmail?: never; email: string };

const EmailVerificationModal = ({
  newEmail,
  email,
}: EmailVerificationModalProps) => {
  const { isOpen, closeModal } = useModal();
  const [emailTimer, setEmailTimer] = useState(30);
  const { sendEmailVerificationEmail, sendVerificationEmail } = useAuth();
  const { t } = useTranslation(undefined, {
    keyPrefix: "checkEmailInbox_modal",
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const resendEmail = useCallback(async () => {
    try {
      if (newEmail) await sendEmailVerificationEmail(newEmail);
      else if (email) await sendVerificationEmail();
      setEmailTimer(60);
    } catch (error) {
      logError(error);
    }
  }, [email, newEmail, sendEmailVerificationEmail, sendVerificationEmail]);

  return (
    <div className="w-full flex flex-col items-center mt-5 text-center">
      <h3 className="text-xl font-bold mb-2.5 md:text-2xl">{t("title")}</h3>
      <p className="text-grayscale-60 font-medium -tracking-[0.16px] mb-3">
        {t("description", { email: newEmail || email })}
      </p>
      <p className="text-grayscale-60 font-medium -tracking-[0.16px] max-w-lg mb-[30px]">
        <Trans
          i18nKey={"checkEmailInbox_modal.secondary_description"}
          components={{
            underline: email ? (
              <a
                className="underline text-grayscale-90 underline-offset-4 md:no-underline"
                href="/settings/edit-profile"
              />
            ) : (
              <span
                className="underline text-grayscale-90 underline-offset-4 cursor-pointer"
                onClick={closeModal}
              />
            ),
          }}
        />
      </p>
      <Button
        type="button"
        disabled={emailTimer > 0}
        onClick={resendEmail}
        className="w-full bg-black rounded-xl py-7 font-semibold text-[15px] disabled:bg-grayscale-6 disabled:text-black disabled:opacity-100"
      >
        {t(emailTimer > 0 ? "button_with_time" : "button", {
          time: emailTimer,
        })}
      </Button>
    </div>
  );
};

export default EmailVerificationModal;
