import { Button } from "@/components/ui/button";
import { useCheckout } from "../hooks/useCheckout";
import PaymentMethodCard from "./PaymentMethod";
import { useTranslation } from "react-i18next";
import { retrySubscriptionPayment } from "../services/callable";
import { useDispatch, useSelector } from "react-redux";
import { selectCreatorId } from "@/store/selectors/creatorProfileSelectors";
import { useToast } from "@/components/ui/use-toast";
import { logError, logInfo } from "@/services/logging";
import { useCallback, useState } from "react";
import { AppDispatch } from "@/store";
import {
  updateIsPastDue,
  updateIsSubscribed,
} from "@/store/reducers/creatorProfileReducer";
import { useSubscriptionResumedModal } from "../hooks/useSubscriptionResumedModal";

export const CompletePaymentModal = () => {
  const { savedCard } = useCheckout();
  const { t } = useTranslation();
  const creatorId = useSelector(selectCreatorId);
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { openSuccessfulSubscriptionResumedModal } =
    useSubscriptionResumedModal();

  const handleCompletePayment = useCallback(async () => {
    try {
      if (!creatorId) {
        throw new Error("Educator ID is required.");
      }
      setIsRetrying(true);
      const { data } = await retrySubscriptionPayment({ creatorId });
      logInfo("Payment retried", data.invoiceId);
      // optimistic update
      dispatch(updateIsSubscribed(true));
      dispatch(updateIsPastDue(false));
      openSuccessfulSubscriptionResumedModal();
    } catch (error) {
      logError(error);
      toast({
        text:
          error instanceof Error ? error.message : "Failed to retry payment",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
    }
  }, [creatorId, dispatch, toast, openSuccessfulSubscriptionResumedModal]);
  return (
    <div className="flex flex-col gap-4 max-w-[327px] mx-auto">
      {savedCard && (
        <PaymentMethodCard
          paymentMethod={savedCard}
          className="bg-grayscale-4 py-2.5 pl-3 pr-4 rounded-2xl"
          isCheckout={true}
        />
      )}
      <Button
        onClick={handleCompletePayment}
        disabled={!savedCard}
        loading={isRetrying}
      >
        {t("complete_payment")}
      </Button>
    </div>
  );
};
