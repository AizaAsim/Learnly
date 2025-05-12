import { useModal } from "@/hooks/useModal";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/features/Stripe/services/stripe";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AddCardModal } from "../components/PaymentMethod/AddCardModal";

export const useAddCardModal = (showWarning?: boolean) => {
  const { setModal, openModal } = useModal();
  const { t } = useTranslation(undefined, { keyPrefix: "paymentMethod" });

  const openAddCardModal = useCallback(() => {
    setModal(
      <Elements stripe={getStripe()}>
        <AddCardModal showWarning={showWarning} />
      </Elements>,
      {
        title: t("addText"),
        sheetHeaderClassNames: "mb-8",
      }
    );
    openModal();
  }, [setModal, openModal, t, showWarning]);

  return { openAddCardModal };
};
