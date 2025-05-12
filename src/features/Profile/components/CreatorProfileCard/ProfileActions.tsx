import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/ui/subscribe-button";
import SvgIcon from "@/components/ui/svg-icon";
import { useToast } from "@/components/ui/use-toast";
import { useActivateSubscriptionModals } from "@/features/Stripe/hooks/useActivateSubscriptionModals";
import { useCompletePaymentModal } from "@/features/Stripe/hooks/useCompletePaymentModal";
import { useSubscribeModal } from "@/features/Stripe/hooks/useSubscribeModal";
import { resumeSubscription } from "@/features/Stripe/services/callable";
import { cn } from "@/lib/utils";
import { logError } from "@/services/logging";
import { AppDispatch } from "@/store";
import { updateCancelAtPeriodEnd } from "@/store/reducers/creatorProfileReducer";
import { AlertCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProfileActionsProps {
  id: string;
  isSubscriptionActivated: boolean;
  subscriptionPrice: number;
  isSubscribed: boolean;
  isOwner: boolean;
  cancelAtPeriodEnd: boolean;
  isPastDue: boolean;
  isCreatorAccountDeleted: boolean;
}

export const ProfileActions = ({
  id,
  isSubscriptionActivated,
  subscriptionPrice,
  isSubscribed,
  isOwner,
  cancelAtPeriodEnd,
  isPastDue,
  isCreatorAccountDeleted,
}: ProfileActionsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openSetPriceModal } = useActivateSubscriptionModals();
  const { openCompletePaymentModal } = useCompletePaymentModal();
  const { openSubscribeCheckout, loading: checkoutLoading } =
    useSubscribeModal();
  const { toast } = useToast();
  const [isResumingSubscription, setIsResumingSubscription] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // TODO: Replace with actual data
  const isUserBlocked = false;

  const handleSubscription = useCallback(async () => {
    openSubscribeCheckout(id);
  }, [id, openSubscribeCheckout]);

  const handleResumeSubscription = useCallback(async () => {
    try {
      setIsResumingSubscription(true);
      await resumeSubscription({ creatorId: id });
      dispatch(updateCancelAtPeriodEnd(false));
    } catch (error) {
      logError(error);
      let message = "Failed to resume subscription";
      if (error instanceof Error) message = error.message;
      toast({ text: message, variant: "destructive", className: "w-[304px]" });
    } finally {
      setIsResumingSubscription(false);
    }
  }, [id, toast, dispatch]);

  return (
    <div>
      {isCreatorAccountDeleted && (
        <Button
          className={cn("select-none pointer-events-none", classes.button)}
          variant="destructive"
          icon={<AlertCircle size={20} />}
        >
          {t("account_deleted_button")}
        </Button>
      )}
      {!isCreatorAccountDeleted && (
        <>
          {isOwner && !isSubscriptionActivated && (
            <Button
              className={cn(classes.button)}
              icon={<SvgIcon src="/icon/star.svg" className="w-5 h-5" />}
              onClick={openSetPriceModal}
            >
              {t("activateSubscription.button")}
            </Button>
          )}
          {isOwner && isSubscriptionActivated && (
            <Button
              className={cn(classes.button)}
              icon={<SvgIcon src="/icon/star.svg" className="w-5 h-5" />}
              variant="secondary"
              disabled
              onClick={() => navigate("/settings/manage-subscription")}
            >
              {t("activateSubscription.manageSubscription")}
            </Button>
          )}
          {!isOwner && !isSubscribed && !isPastDue && (
            <SubscribeButton
              className={cn(classes.button)}
              subscriptionPrice={subscriptionPrice}
              disabled={isUserBlocked || checkoutLoading}
              onClick={handleSubscription}
            />
          )}
          {!isOwner && !isSubscribed && isPastDue && (
            <Button
              className={cn(classes.button)}
              icon={
                <SvgIcon
                  src="/icon/info-white-outlined.svg"
                  className="w-5 h-5"
                />
              }
              onClick={openCompletePaymentModal}
            >
              {t("complete_payment")}
            </Button>
          )}
          {!isOwner && isSubscribed && cancelAtPeriodEnd && (
            <Button
              className={cn(classes.button)}
              icon={<SvgIcon src="/icon/star.svg" className="w-5 h-5" />}
              onClick={async () => await handleResumeSubscription()}
              disabled={isResumingSubscription}
              loading={isResumingSubscription}
            >
              {t("resume_subscription_button")}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

const classes = {
  button: "mt-5 md:mt-0 gap-2 w-[272px] md:w-[442px] max-w-full",
};
