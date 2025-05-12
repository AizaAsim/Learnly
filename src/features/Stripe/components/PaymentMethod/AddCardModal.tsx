import { Button } from "@/components/ui/button";
import { CheckoutFields } from "@/components/ui/checkout-fields";
import { useModal } from "@/hooks/useModal";
import { logError } from "@/services/logging";
import { AppDispatch } from "@/store";
import {
  addOptimisticPaymentMethod,
  removePendingAddition,
} from "@/store/reducers/paymentMethodsReducer";
import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useCheckout } from "../../hooks/useCheckout";

interface AddCardModalProps {
  showWarning?: boolean;
}

export const AddCardModal = ({ showWarning = false }: AddCardModalProps) => {
  const {
    cardHolderName,
    setCardHolderName,
    error,
    isSubmitting,
    handleSaveNewCard,
    stripe,
    elements,
  } = useCheckout();
  const { t } = useTranslation(undefined, { keyPrefix: "paymentMethod" });
  const { closeModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;

    // Dispatch optimistic update
    dispatch(addOptimisticPaymentMethod(tempId));

    try {
      const isSuccess = await handleSaveNewCard(e);

      if (isSuccess) {
        // Close the modal immediately after successful submission
        closeModal();
      } else {
        // Remove the optimistic update if save failed
        dispatch(removePendingAddition(tempId));
      }
    } catch (error) {
      // Remove the optimistic update on error
      dispatch(removePendingAddition(tempId));
      logError(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <CheckoutFields
          cardHolderName={cardHolderName}
          setCardHolderName={setCardHolderName}
          error={error}
        />
        {showWarning && (
          <div className="flex gap-2 bg-yellow-t20 p-3 pr-4 rounded-[14px] mt-4">
            <img src="/icon/info-orange.svg" className="w-6 h-6" />
            <p className="text-grayscale-80 text-sm leading-4.5 -tracking-[0.14px] font-semibold">
              {t("futureSubscriptionsWarning")}
            </p>
          </div>
        )}
        <div className="mt-4 flex flex-col">
          <Button
            loading={isSubmitting}
            disabled={!stripe || !elements || !cardHolderName || isSubmitting}
          >
            {t("addButton")}
          </Button>
        </div>
      </form>
    </div>
  );
};
