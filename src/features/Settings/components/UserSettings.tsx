import { SettingsLink } from "./SettingsLink";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function UserSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <SettingsLink
        icon="/icon/payment-methods/card.svg"
        text={t("settings_text_paymentMethod")}
        onClick={() => navigate("/settings/payment-method")}
      />
      <SettingsLink
        icon="/icon/receipt.svg"
        text={t("settings_text_billingHistory")}
        onClick={() => navigate("/settings/billing-history")}
      />
    </>
  );
}
