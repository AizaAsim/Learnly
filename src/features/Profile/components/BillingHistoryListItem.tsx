import { UserListItem } from "@/components/UserListItem";
import { UserRootDoc } from "@/features/Auth/types";
import { useDocumentOnce } from "@/hooks/useDocumentOnce";
import { useModal } from "@/hooks/useModal";
import { Invoice } from "../../Stripe/types";
import { BillingHistoryItem } from "./BillingHistoryItem";
import { format } from "date-fns";

interface BillingHistoryItemProps {
  invoice: Invoice;
}

export const BillingHistoryListItem = ({
  invoice,
}: BillingHistoryItemProps) => {
  const {
    document: creator,
    loading,
    error,
  } = useDocumentOnce<UserRootDoc>("users", invoice.creatorUid);
  const { openModal, setModal } = useModal();

  const handleClick = () => {
    if (!creator) return;
    setModal(
      <BillingHistoryItem
        invoiceId={invoice.id}
        amountPaid={invoice.amountPaid}
        creatorUsername={creator?.username}
        last4CardDigits={invoice.paymentMethod.last4}
      />,
      {
        title: "Subscription",
        subtitle: format(invoice.createdAt.toDate(), "MMMM d, yyyy h:mm a"),
      }
    );
    openModal();
  };

  return (
    <UserListItem
      loading={loading}
      error={error?.message}
      onClick={handleClick}
      avatarUrl={creator?.avatar_url || null}
      leftTopContent={
        <>
          <p>@{creator?.username}</p>
          {/* TODO: change the condition after there is verification flag */}
          {false && (
            <img
              src="/icon/verification-badge.svg"
              className="w-[18px] h-[18px]"
            />
          )}
        </>
      }
      rightContent={
        <p className="text-[15px] font-semibold -tracking-[0.225px] leading-5 md:text-lg md:font-semibold md:leading-6">
          ${(invoice.amountPaid / 100).toFixed(2)}
        </p>
      }
    />
  );
};
