import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckoutFields } from "@/components/ui/checkout-fields";
import { useCheckout } from "../../hooks/useCheckout";
import { Trans, useTranslation } from "react-i18next";
import PaymentMethodCard from "../PaymentMethod";
import { useDocumentOnce } from "@/hooks/useDocumentOnce";
import { UserDoc } from "@/features/Auth/types";
import { Spinner } from "@/components/ui/spinner";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { CreatorSubscriptionInfo } from "@/types";
import { useEffect } from "react";
import { Subscriber } from "../../types";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useUserBlocked } from "@/features/Profile/hooks/useUserBlocked";
import { useSelector } from "react-redux";
import { selectCreatorProfileData } from "@/store/selectors/creatorProfileSelectors";
import { SubscribeButton } from "@/components/ui/subscribe-button";
import {
  checkoutContainerVariants,
  checkoutItemVariants,
} from "./animation-variants";

interface SubscriptionCheckoutProps {
  creatorId: string;
  onSuccessfulSubscription: () => void;
}

export const SubscriptionCheckout = ({
  creatorId,
  onSuccessfulSubscription,
}: SubscriptionCheckoutProps) => {
  const { user } = useAuth();
  const {
    cardHolderName,
    setCardHolderName,
    error,
    isSubmitting,
    handleSubscriptionSubmit,
    stripe,
    elements,
    savedCard,
    useExistingCard,
  } = useCheckout(creatorId, onSuccessfulSubscription);
  const { document: creator, loading: creatorLoading } =
    useDocumentOnce<UserDoc>("users", creatorId);
  const { isBlocked, loading: blockedUsersLoading } = useUserBlocked(creatorId);
  const profileData = useSelector(selectCreatorProfileData);

  const {
    documents: creatorSubscriptions,
    fetchDocuments: fetchCreatorSubscriptions,
    loading: creatorSubscriptionsLoading,
  } = useFirestoreCollection<CreatorSubscriptionInfo>({
    collectionPath: "creators_subscriptions",
    batchSize: 1,
    orderByField: "subscriptionPrice",
    orderByDirection: "desc",
    whereClauses: [["creatorUid", "==", creatorId]],
  });

  const {
    documents: subscibers,
    fetchDocuments: fetchSubscribers,
    loading: userSubscriptionsLoading,
  } = useFirestoreCollection<Subscriber>({
    collectionPath: "learners",
    batchSize: 1,
    orderByField: "startDate",
    orderByDirection: "desc",
    whereClauses: [
      ["creatorId", "==", creatorId],
      ["status", "in", ["active", "trialing", "past_due"]],
      ["subscriberId", "==", user?.uid],
    ],
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      fetchCreatorSubscriptions();
      fetchSubscribers();
    }
  }, [user, fetchCreatorSubscriptions, fetchSubscribers]);

  const isAlreadySubscribed = subscibers && subscibers.length > 0;

  const isSubscriptionBtnDisabled =
    !stripe || (!elements && !useExistingCard) || isSubmitting;

  const subscriptionPrice = creatorSubscriptions[0]?.subscriptionPrice;

  function getButtonText() {
    if (isBlocked) return t("checkout.user_blocked");
    if (isAlreadySubscribed) return t("checkout.already_subscribed");
  }

  if (
    creatorLoading ||
    creatorSubscriptionsLoading ||
    userSubscriptionsLoading ||
    blockedUsersLoading
  )
    return <Spinner className="h-[370px]" />;

  if (!creator || creatorSubscriptions.length === 0)
    return <div>{t("checkout.creator_not_found")}</div>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={checkoutContainerVariants}
    >
      <motion.div
        className="flex flex-col gap-3 w-[232px] mx-auto mb-8 text-grayscale-80 -tracking-[0.16px] leading-[22px] font-semibold"
        variants={checkoutItemVariants}
      >
        {["video-checkout", "eye-checkout", "heart-checkout"].map(
          (icon, index) => (
            <motion.p
              key={icon}
              className="flex gap-2 items-center"
              variants={checkoutItemVariants}
              whileHover={{ x: 5 }}
            >
              <img src={`/icon/${icon}.svg`} className="size-[26px]" />
              {t(`checkout.features.${index + 1}`, {
                noOfReels: profileData?.counts.active,
              })}
            </motion.p>
          )
        )}
      </motion.div>

      <motion.form
        onSubmit={handleSubscriptionSubmit}
        variants={checkoutItemVariants}
      >
        <AnimatePresence mode="wait">
          {savedCard && useExistingCard ? (
            <motion.div
              key="saved-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentMethodCard
                paymentMethod={savedCard}
                className="bg-grayscale-4 py-2.5 pl-3 pr-4 rounded-2xl"
                isCheckout={true}
              />
            </motion.div>
          ) : (
            <motion.div
              key="checkout-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckoutFields
                cardHolderName={cardHolderName}
                setCardHolderName={setCardHolderName}
                error={error}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={checkoutItemVariants} className="mt-4">
          {!isBlocked && !isAlreadySubscribed ? (
            <SubscribeButton
              subscriptionPrice={subscriptionPrice}
              className="w-full"
              disabled={isSubscriptionBtnDisabled}
              loading={isSubmitting}
              loadingIcon={
                <img
                  src="/icon/loading-white.svg"
                  className="w-5 h-5 animate-spin"
                />
              }
              monthLabel="full"
            />
          ) : (
            <Button
              className="w-full disabled:opacity-70"
              disabled={
                isBlocked || isAlreadySubscribed || isSubscriptionBtnDisabled
              }
              type="submit"
            >
              {getButtonText()}
            </Button>
          )}
        </motion.div>
      </motion.form>
      <motion.p
        className="text-xs font-medium -tracking-[0.12px] text-grayscale-50 text-center mt-4"
        variants={checkoutItemVariants}
      >
        <Trans
          i18nKey={"checkout.note"}
          values={{ termsOfUseLink: "#", privacyPolicyLink: "#" }}
          components={{
            customlink: <a className="text-grayscale-80 underline"></a>,
          }}
        />
      </motion.p>
    </motion.div>
  );
};
