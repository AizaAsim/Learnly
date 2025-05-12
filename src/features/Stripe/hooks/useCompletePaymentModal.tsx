import { useModal } from "@/hooks/useModal";
import { Elements } from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CompletePaymentModal } from "../components/CompletePaymentModal";
import { getStripe } from "../services/stripe";

export const useCompletePaymentModal = () => {
  const { setModal, openModal } = useModal();
  const { t } = useTranslation();

  const openCompletePaymentModal = useCallback(() => {
    setModal(
      <Elements stripe={getStripe()}>
        <CompletePaymentModal />
      </Elements>,
      {
        title: t("complete_payment"),
      }
    );
    openModal();
  }, [setModal, openModal, t]);

  return { openCompletePaymentModal };
};
