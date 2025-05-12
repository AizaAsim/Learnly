import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { SubscriptionBillingHistoryListItem } from "@/features/Profile/components/SubscriptionBillingHistoryListItem";
import { Invoice } from "@/features/Stripe/types";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useParams } from "react-router-dom";

const SubscriptionBillingHistoryPage = () => {
  const { subscriptionId } = useParams();
  const [, subscriberUid] = subscriptionId?.split("_") || [];
  const { user } = useAuth();
  const {
    documents: invoices,
    fetchDocuments: fetchInvoices,
    hasMore,
    loading,
    error,
  } = useFirestoreCollection<Invoice>({
    collectionPath: "invoices",
    batchSize: 10,
    orderByField: "createdAt",
    orderByDirection: "desc",
    whereClauses: [
      ["subscriberUid", "==", subscriberUid],
      ["creatorUid", "==", user?.uid],
    ],
    ignoreExclusions: true,
  });

  return (
    <ScrollViewContainer className="overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <InfiniteScrollList
          hasMore={hasMore}
          loading={loading}
          fetchData={fetchInvoices}
          error={error}
        >
          {invoices.map((invoice) => (
            <SubscriptionBillingHistoryListItem
              key={invoice.id}
              invoice={invoice}
            />
          ))}
        </InfiniteScrollList>
      </div>
    </ScrollViewContainer>
  );
};

export default SubscriptionBillingHistoryPage;
