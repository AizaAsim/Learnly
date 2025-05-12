import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import EmailVerificationModal from "@/features/Settings/components/EmailVerificationModal";
import { useModal } from "@/hooks/useModal";
import { logError } from "@/services/logging";
import { useTranslation } from "react-i18next";

export const VerifyEmail = () => {
  const { sendVerificationEmail, isLoading, user } = useAuth();
  const { openModal, setModal } = useModal();
  const { t } = useTranslation(undefined, {
    keyPrefix: "activateSubscription.verifyEmail_modal",
  });

  const openEmailVerificationModal = () => {
    setModal(<EmailVerificationModal email={user?.email || "Email Address"} />);
    openModal();
  };

  return (
    <div className="max-w-[311px] mx-auto">
      <p className="text-center text-grayscale-60 font-medium -tracking-[0.16px] mb-[30px]">
        {t("description")}
      </p>

      <Button
        className="w-full"
        onClick={async () => {
          try {
            await sendVerificationEmail();
            openEmailVerificationModal();
          } catch (error) {
            logError(error);
          }
        }}
        disabled={isLoading}
      >
        {t("button")}
      </Button>
    </div>
  );
};
