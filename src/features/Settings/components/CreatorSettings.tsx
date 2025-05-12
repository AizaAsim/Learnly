import { useTranslation } from "react-i18next";
import { SettingsLink } from "./SettingsLink";
import { useNavigate } from "react-router-dom";

export function CreatorSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <SettingsLink
        icon={"/icon/star-1.svg"}
        text={t("settings_text_manage_subscription")}
        onClick={() => navigate("/settings/manage-subscription")}
      />
    </>
  );
}
