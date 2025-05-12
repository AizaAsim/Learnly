import { Subscriber } from "@/features/Stripe/types";
import { formatCurrency, timestampToDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import StatsDisplay from "./StatsDisplay";
import { differenceInMonths } from "date-fns";

interface SubscriberItemProps {
  subscription: Subscriber;
  onPaymentClick?: (subscriberId: string) => void;
}

export const SubscriberItem = ({ subscription }: SubscriberItemProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "subscription_info" });

  const startDate = timestampToDate(subscription.startDate);
  const currentDate = new Date();
  const monthsSubscribed = differenceInMonths(currentDate, startDate);

  const subscriberData = {
    [t("status")]:
      subscription.status === "trialing" ? "Active" : subscription.status,
    [t("lifetimeSpend")]: formatCurrency(subscription.lifeTimeSpend / 100),
    [t("monthsSubscribed")]: monthsSubscribed,
    // It is decided to not include subscriber billing history in the app
    // [t("billingHistory")]: (
    //   <img
    //     src="/icon/chevron-right-dark.svg"
    //     className="ml-auto w-5 h-5 cursor-pointer"
    //     onClick={() => onPaymentClick(subscription.id)}
    //   />
    // ),
  };

  return (
    <div className="flex flex-col">
      <StatsDisplay data={subscriberData} className="mt-0" />
    </div>
  );
};
