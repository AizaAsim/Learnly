import { Invoice } from "@/features/Stripe/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface SubscriptionPaymentListItemProps {
  invoice: Invoice;
}

export const SubscriptionBillingHistoryListItem = ({
  invoice,
}: SubscriptionPaymentListItemProps) => {
  return (
    <div className="flex items-center justify-between px-5 py-2 select-none">
      <div className="flex items-center gap-2.5">
        <div className="w-[46px] h-[46px] bg-green-t10 flex justify-center items-center rounded-full  md:w-[60px] md:h-[60px]">
          <img
            src="/icon/checkmark-circular.svg"
            className="w-6 h-6 md:w-7 md:h-7"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-grayscale-100 text-[15px] font-semibold leading-5 capitalize -tracking-[0.225px] md:text-lg md:leading-6 md:font-semibold md:tracking-normal">
            Subscription
          </div>
          <p className="text-grayscale-70 text-sm font-medium -tracking-[0.14px] leading-[18px] md:text-grayscale-80 md:text-base md:-tracking-[0.16px]">
            {format(invoice.createdAt.toDate(), "MMM d")}
          </p>
        </div>
      </div>
      <p className="text-[15px] font-semibold -tracking-[0.255px] leading-5 md:text-lg md:font-semibold md:leading-6">
        +{formatCurrency(invoice.amountPaid / 100)}
      </p>
    </div>
  );
};
