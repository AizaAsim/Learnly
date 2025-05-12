import { NoContentDisplay } from "@/components/NoContentDisplay";
import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { BillingHistoryListItem } from "@/features/Profile/components/BillingHistoryListItem";
import { Invoice } from "@/features/Stripe/types";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { format, isToday, isYesterday } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const BillingHistoryPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    documents: invoices,
    fetchDocuments: fetchInvoices,
    hasMore,
    loading,
    error,
  } = useFirestoreCollection<Invoice>({
    collectionPath: "invoices",
    batchSize: 20,
    orderByField: "createdAt",
    orderByDirection: "desc",
    whereClauses: [["subscriberUid", "==", user?.uid]],
    useCollectionGroup: false,
    ignoreExclusions: true,
  });

  const groupedInvoices = useMemo(() => {
    const groupInvoicesByDate = (invoices: Invoice[]) => {
      return invoices.reduce(
        (groups, invoice) => {
          const invoiceDate = invoice.createdAt.toDate();
          let dateLabel;

          if (isToday(invoiceDate)) dateLabel = t("today");
          else if (isYesterday(invoiceDate)) dateLabel = t("yesterday");
          else dateLabel = format(invoiceDate, "MMMM d");

          if (!groups[dateLabel]) {
            groups[dateLabel] = [];
          }
          groups[dateLabel].push(invoice);
          return groups;
        },
        {} as Record<string, Invoice[]>
      );
    };

    return groupInvoicesByDate(invoices);
  }, [invoices, t]);

  return (
    <ScrollViewContainer className="overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {invoices.length === 0 && !loading && (
          <NoContentDisplay
            text={t("empty_billing_history")}
            iconSrc="/icon/receipt-light.svg"
            textClassName="w-[192px]"
          />
        )}
        <InfiniteScrollList
          loading={loading}
          hasMore={hasMore}
          fetchData={fetchInvoices}
          error={error}
          className="py-2"
        >
          <div className="flex flex-col gap-3 md:gap-5">
            {Object.entries(groupedInvoices).map(([date, invoices]) => (
              <div key={date}>
                <h4 className="ml-4 text-grayscale-50 text-sm font-semibold -tracking-[0.14px] leading-[18px] md:text-base md:-tracking-[0.16px]">
                  {date}
                </h4>
                {invoices.map((invoice) => (
                  <BillingHistoryListItem key={invoice.id} invoice={invoice} />
                ))}
              </div>
            ))}
          </div>
        </InfiniteScrollList>
      </div>
    </ScrollViewContainer>
  );
};

export default BillingHistoryPage;
