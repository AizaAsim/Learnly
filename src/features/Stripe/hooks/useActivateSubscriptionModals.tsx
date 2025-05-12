import { useModal } from "@/hooks/useModal";
import { useCallback, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { AddPayoutMethod } from "../components/AddPayoutMethod";
import { CountriesSupported } from "../components/CountriesSupported";
import { SetPrice } from "../components/SetPrice";
import { VerifyEmail } from "../components/VerifyEmail";

interface ModalFunctions {
  openSetPriceModal: () => void;
  openCountriesSupportedModal: () => void;
  openAddPayoutMethodModal: () => void;
  openVerifyEmailModal: () => void;
}

export const useActivateSubscriptionModals = (): ModalFunctions => {
  const { openModal, setModal } = useModal();
  const { t } = useTranslation(undefined, {
    keyPrefix: "activateSubscription",
  });

  const functionsRef = useRef<Partial<ModalFunctions>>({});

  const openSetPriceModal = useCallback(async () => {
    setModal(
      <SetPrice
        onSuccess={functionsRef.current.openCountriesSupportedModal}
        showNote={true}
        className="max-w-[375px] md:max-w-[443px] mx-auto"
        disableBasedOnIsModified={false}
      />,
      {
        title: t("setPrice.title"),
        subtitle: t("setPrice.description"),
        sheetSubTitleClassNames: "max-w-[375px] md:max-w-[443px] mx-auto",
        dialogSubTitleClassNames: "max-w-[375px] md:max-w-[443px] mx-auto",
      }
    );
    openModal();
  }, [setModal, openModal, t]);

  const openCountriesSupportedModal = useCallback(() => {
    setModal(
      <CountriesSupported />,
      {
        title: t("countriesSupported_modal.title"),
        subtitle: (
          <Trans
            i18nKey={
              "activateSubscription.countriesSupported_modal.description"
            }
            components={{
              strong: <span className="font-semibold" />,
            }}
          />
        ),
      },
      {
        showBackIcon: true,
        onBackClick: functionsRef.current.openSetPriceModal,
      }
    );
    openModal();
  }, [setModal, openModal, t]);

  const openAddPayoutMethodModal = useCallback(() => {
    setModal(
      <AddPayoutMethod />,
      {
        title: t("addPayoutMethod_modal.title"),
        subtitle: (
          <Trans
            i18nKey={"activateSubscription.addPayoutMethod_modal.description"}
            components={{
              strong: <span className="font-semibold" />,
            }}
          />
        ),
      },
      {
        showBackIcon: true,
        onBackClick: functionsRef.current.openCountriesSupportedModal,
      }
    );
    openModal();
  }, [setModal, openModal, t]);

  const openVerifyEmailModal = useCallback(() => {
    setModal(<VerifyEmail />, { title: t("verifyEmail_modal.title") });
    openModal();
  }, [setModal, openModal, t]);

  // Update the ref with the latest function references
  functionsRef.current = {
    openSetPriceModal,
    openCountriesSupportedModal,
    openAddPayoutMethodModal,
    openVerifyEmailModal,
  };

  return {
    openSetPriceModal,
    openCountriesSupportedModal,
    openAddPayoutMethodModal,
    openVerifyEmailModal,
  };
};
