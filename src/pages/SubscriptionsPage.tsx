import { NoContentDisplay } from "@/components/NoContentDisplay";
import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { SubscriptionListItem } from "@/features/Profile/components/SubscriptionListItem";
import { Subscriber } from "@/features/Stripe/types";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useTranslation } from "react-i18next";

const SubscriptionsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    documents: subscriptions,
    fetchDocuments: fetchSubscriptions,
    loading,
    hasMore,
    error,
  } = useFirestoreCollection<Subscriber>({
    collectionPath: "learners",
    batchSize: 20,
    orderByField: "startDate",
    orderByDirection: "desc",
    whereClauses: [
      ["subscriberId", "==", user?.uid],
      ["status", "in", ["active", "trialing"]],
    ],
    useCollectionGroup: false,
    ignoreExclusions: true,
  });

  return (
    <ScrollViewContainer className="overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {subscriptions.length === 0 && !loading && (
          <NoContentDisplay
            text={t("empty_subscriptions")}
            iconSrc="/icon/star-light.svg"
            textClassName="w-[221px]"
          />
        )}
        <InfiniteScrollList
          loading={loading}
          hasMore={hasMore}
          fetchData={fetchSubscriptions}
          error={error}
          className="py-2"
        >
          <div className="mt-2">
            {subscriptions.map((subscription) => (
              <SubscriptionListItem
                key={subscription.id}
                creatorId={subscription.creatorId}
              />
            ))}
          </div>
        </InfiniteScrollList>
      </div>
    </ScrollViewContainer>
  );
};

export default SubscriptionsPage;
