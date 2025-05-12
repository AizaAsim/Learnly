import { RecoveryMethod, RecoveryMethods } from "@/features/Auth/types";
import { RecoveryMethodModal } from "@/features/Settings/components/RecoveryMethodModal";
import { RecoveryMethodVerificationModal } from "@/features/Settings/components/RecoveryMethodVerificationModal";
import { useModal } from "@/hooks/useModal";
import { useCallback, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { formatPhoneNumber } from "../../../lib/utils";

interface ModalFunctions {
  openRecoveryMethodModal: (
    recoveryMethod: RecoveryMethod,
    existingValue?: string
  ) => void;
  openRecoveryMethodVerificationModal: (
    recoveryMethod: RecoveryMethod,
    value: string
  ) => void;
}

export const useRecoveryMethodModals = (): ModalFunctions => {
  const { openModal, setModal } = useModal();
  const { t } = useTranslation();

  const functionsRef = useRef<Partial<ModalFunctions>>({});

  const openRecoveryMethodModal = useCallback(
    (recoveryMethod: RecoveryMethods, existingValue?: string) => {
      setModal(
        <RecoveryMethodModal
          recoveryMethod={recoveryMethod}
          existingValue={existingValue}
        />,
        {
          title: t(
            !existingValue
              ? "recoveryMethod_modal.title"
              : "recoveryMethod_modal.title_update",
            {
              method:
                recoveryMethod === RecoveryMethods.EMAIL ? "Email" : "Phone",
            }
          ),
          subtitle: t(
            !existingValue
              ? "recoveryMethod_modal.description"
              : "recoveryMethod_modal.description_update",
            {
              method:
                recoveryMethod === RecoveryMethods.EMAIL
                  ? "an email address"
                  : "a phone number",
            }
          ),
        }
      );
      openModal();
    },
    [setModal, openModal, t]
  );

  const openRecoveryMethodVerificationModal = useCallback(
    (recoveryMethod: RecoveryMethods, value: string) => {
      if (value) {
        setModal(
          <RecoveryMethodVerificationModal
            recoveryMethod={recoveryMethod}
            value={value}
          />,
          {
            title: t("recoveryMethodVerification_modal.title"),
            subtitle: (
              <Trans
                i18nKey="recoveryMethodVerification_modal.description"
                components={{
                  strong: (
                    <span className="text-ellipsis whitespace-nowrap overflow-hidden font-semibold" />
                  ),
                }}
                values={{
                  value:
                    recoveryMethod === RecoveryMethods.PHONE
                      ? formatPhoneNumber(value)
                      : value,
                }}
              />
            ),
          },
          {
            showBackIcon: true,
            onBackClick: () =>
              functionsRef.current.openRecoveryMethodModal?.(recoveryMethod),
          }
        );
        openModal();
      }
    },
    [setModal, t, openModal]
  );

  // Update the ref with the latest function references
  functionsRef.current = {
    openRecoveryMethodModal,
    openRecoveryMethodVerificationModal,
  };

  return {
    openRecoveryMethodModal,
    openRecoveryMethodVerificationModal,
  };
};
