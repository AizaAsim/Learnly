import { Button } from "@/components/ui/button";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { UserSubscription } from "../types";
import { Spinner } from "@/components/ui/spinner";
import { Error } from "@/components/ui/error";
import { firebaseTimestampToReadAbleDate } from "@/lib/utils";
import { logError } from "@/services/logging";
import { useSuccessfulUnsubscribeModal } from "../hooks/useSuccessfulUnsubscribeModal";

interface UnsubscribeCreatorProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  creatorId: string;
  userId: string;
  isExpiring?: boolean;
}

export const UnsubscribeCreator = ({
  onClose,
  onConfirm,
  creatorId,
  userId,
}: UnsubscribeCreatorProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "cancel_subscription" });

  const {
    documents: subscriptions,
    fetchDocuments: fetchSubscriptions,
    loading: subscriptionsLoading,
    error: subscriptionsError,
  } = useFirestoreCollection<UserSubscription>({
    collectionPath: "users_subscriptions",
    batchSize: 1,
    orderByField: "startDate",
    orderByDirection: "desc",
    whereClauses: [
      ["subscriberUid", "==", userId],
      ["creatorUid", "==", creatorId],
      ["status", "in", ["active", "trialing"]],
    ],
    useCollectionGroup: false,
    ignoreExclusions: true,
  });
  const { openSuccessfulUnsubscribeModal } = useSuccessfulUnsubscribeModal();
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);

  const handleUnsubscribe = async () => {
    try {
      setIsUnsubscribing(true);
      await onConfirm();
      onClose();
      setIsUnsubscribing(false);
      openSuccessfulUnsubscribeModal(subscriptions[0].currentPeriodEnd);
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  if (subscriptionsLoading) return <Spinner />;

  if (subscriptionsError || subscriptions.length === 0)
    return (
      <Error>
        An error occurred {subscriptionsError} {subscriptions.length}
      </Error>
    );

  return (
    <div>
      <h3 className="font-bold text-center text-xl leading-[26px] mb-2.5">
        {t("headline")}
      </h3>

      <p className="text-grayscale-60 font-medium -tracking-[0.16px] text-center mb-8">
        <Trans
          i18nKey="cancel_subscription.description"
          values={{
            expirationDate: firebaseTimestampToReadAbleDate(
              subscriptions[0].currentPeriodEnd
            ),
          }}
          components={{
            strong: <span className="font-semibold" />,
          }}
        />
      </p>
      <div className="flex flex-col gap-4">
        <Button
          className="w-full"
          onClick={handleUnsubscribe}
          disabled={isUnsubscribing}
        >
          {t("confirm")}
        </Button>

        <Button
          variant="ghost"
          className="w-full h-auto py-0 hover:bg-inherit"
          size="sm"
          onClick={onClose}
        >
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
};
