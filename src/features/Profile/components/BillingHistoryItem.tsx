import { useTranslation } from "react-i18next";
import StatsDisplay from "./StatsDisplay";

interface BillingHistoryItemProps {
  invoiceId: string;
  last4CardDigits: string;
  creatorUsername: string;
  amountPaid: number;
}

export const BillingHistoryItem = ({
  invoiceId,
  last4CardDigits,
  creatorUsername,
  amountPaid,
}: BillingHistoryItemProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "billing_history" });

  const stats = {
    [t("invoiceId")]: invoiceId,
    [t("card")]: `•••• ${last4CardDigits}`,
    [t("creator")]: `@${creatorUsername}`,
    [t("totalUsd")]: `$${(amountPaid / 100).toFixed(2)}`,
  };

  return <StatsDisplay data={stats} />;
};
