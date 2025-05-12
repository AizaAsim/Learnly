import { useModal } from "@/hooks/useModal";
import { useCallback, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { UpdateEmailModal } from "../components/UpdateEmailModal";
import { OtpVerificationModal } from "../components/OtpVerificationModal";
import { NewEmailModal } from "../components/NewEmailModal";
import { useAuth } from "@/features/Auth/hooks/useAuth";

interface ModalFunctions {
  openUpdateEmailModal: () => void;
  openOtpVerificationModal: (options: {
    email: string;
    hasSetNewEmail?: boolean;
  }) => void;
  openNewEmailModal: () => void;
}

export const useUpdateEmailModals = (): ModalFunctions => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();
  const { t } = useTranslation();

  const functionsRef = useRef<Partial<ModalFunctions>>({});

  const openUpdateEmailModal = useCallback(() => {
    setModal(<UpdateEmailModal />, {
      title: t("updateEmail_modal.title"),
      subtitle: t("updateEmail_modal.description"),
    });
    openModal();
  }, [openModal, setModal, t]);

  const openOtpVerificationModal = useCallback(
    ({
      email,
      hasSetNewEmail = false,
    }: {
      email: string;
      hasSetNewEmail?: boolean;
    }) => {
      if (email) {
        const title = hasSetNewEmail
          ? t("otpVerification_modal.newEmail_title")
          : t("otpVerification_modal.title");

        const subtitle = (
          <Trans
            i18nKey={
              hasSetNewEmail
                ? "otpVerification_modal.newEmail_description"
                : "otpVerification_modal.description"
            }
            components={{
              strong: <span className="font-semibold" />,
            }}
            values={{ email }}
          />
        );

        setModal(
          <OtpVerificationModal
            email={email}
            hasSetNewEmail={hasSetNewEmail}
          />,
          {
            title,
            subtitle,
          },
          {
            showBackIcon: true,
            onBackClick: () =>
              !hasSetNewEmail
                ? functionsRef.current.openUpdateEmailModal?.()
                : functionsRef.current.openNewEmailModal?.(),
          }
        );
        openModal();
      }
    },
    [setModal, t, openModal]
  );

  const openNewEmailModal = useCallback(() => {
    setModal(
      <NewEmailModal />,
      {
        title: t("newEmail_modal.title"),
        subtitle: t("newEmail_modal.description"),
      },
      {
        showBackIcon: true,
        onBackClick: () =>
          user?.email &&
          functionsRef.current.openOtpVerificationModal?.({
            email: user.email,
          }),
      }
    );
    openModal();
  }, [setModal, t, openModal, user?.email]);

  // Update the ref with the latest function references
  functionsRef.current = {
    openUpdateEmailModal,
    openOtpVerificationModal,
    openNewEmailModal,
  };

  return {
    openUpdateEmailModal,
    openOtpVerificationModal,
    openNewEmailModal,
  };
};
