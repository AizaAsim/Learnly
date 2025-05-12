import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/Auth/hooks/useAuth.tsx";
import { useModal } from "@/hooks/useModal.tsx";
import { useCallback } from "react";
import { useUpdateEmailModals } from "../hooks/useUpdateEmailModals";
import { useTranslation } from "react-i18next";

export function UpdateEmailModal() {
  const { closeModal } = useModal();
  const { user, sendOtpToCurrentEmail } = useAuth();
  const { openOtpVerificationModal } = useUpdateEmailModals();
  const { t } = useTranslation(undefined, {
    keyPrefix: "updateEmail_modal",
  });

  const proceedUpdateEmailProcess = useCallback(async () => {
    if (user?.email) {
      const result = await sendOtpToCurrentEmail();
      if (result?.isValid) openOtpVerificationModal({ email: user?.email });
    }
  }, [sendOtpToCurrentEmail, openOtpVerificationModal, user?.email]);

  return (
    <div className="w-full flex items-center flex-col gap-y-4">
      <Button
        type="button"
        onClick={proceedUpdateEmailProcess}
        className="w-full"
      >
        {t("button_update")}
      </Button>
      <Button
        type="button"
        variant={"link"}
        onClick={closeModal}
        className="text-dark-T50 p-0 h-auto"
      >
        {t("button_cancel")}
      </Button>
    </div>
  );
}
