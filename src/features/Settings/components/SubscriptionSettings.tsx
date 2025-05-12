import { SettingsLink } from "./SettingsLink";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useCreatorStripeData } from "@/features/Stripe/hooks/useCreatorStripeData";
import { constructStripeDashboardUrl } from "@/features/Stripe/utils";

export function SubscriptionSettings({ className }: { className?: string }) {
  const { t } = useTranslation(undefined, {
    keyPrefix: "settings_subscription",
  });
  const navigate = useNavigate();
  const { stripeData } = useCreatorStripeData();
  const stripeConnectId = stripeData?.stripeConnectId;

  const navigateToStripeDashboard = (destinationPath?: string) => {
    if (stripeConnectId) {
      const dashboardUrl = constructStripeDashboardUrl(
        stripeConnectId,
        destinationPath
      );
      window.location.href = dashboardUrl;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col min-w-[50%] rounded-[18px] bg-lightBlue/10",
        className
      )}
    >
      <SettingsLink
        icon="/icon/circular-dollar.svg"
        text={t("price")}
        onClick={() =>
          navigate("/settings/manage-subscription/subscription-price")}
        className="text-primaryBlue"
      />
      <SettingsLink
        icon="/icon/star-1.svg"
        text={t("learners")}
        onClick={() => navigate("/learners")}
        className="text-primaryBlue"
      />
      <SettingsLink
        icon="/icon/payment-methods/payment-method-setup.svg"
        text={t("payout_methods")}
        disabled={!stripeConnectId}
        onClick={() => navigateToStripeDashboard("settings/payouts")}
        className="text-primaryBlue"
      />
      <SettingsLink
        icon="/icon/receipt.svg"
        text={t("payouts")}
        disabled={!stripeConnectId}
        onClick={() => navigateToStripeDashboard("payouts")}
        className="text-primaryBlue"
      />
    </div>
  );
}
