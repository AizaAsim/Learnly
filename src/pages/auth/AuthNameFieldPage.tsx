import { DisplayNameForm } from "@/features/Auth/components/forms/DisplayNameForm";
import { NamesFields } from "@/features/Auth/types";
import { useTranslation } from "react-i18next";
import { AuthTitle } from "@/components/layout/AuthTitle";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AuthNameFieldPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const config = useMemo(() => {
    switch (location.pathname) {
      case "/auth/display-name":
        return {
          field: NamesFields.displayName,
          title: t("displayNameForm_displayName_title"),
          description: t("displayNameForm_displayName_subtitle"),
          nextPath: "/auth/username",
          checkField: user?.displayName,
        };
      case "/auth/username":
        return {
          field: NamesFields.username,
          title: t("displayNameForm_username_title"),
          description: t("displayNameForm_username_subtitle"),
          nextPath: "/auth/socials",
          checkField: user?.username,
        };
      case "/auth/name":
        return {
          field: NamesFields.displayName,
          title: t("displayNameForm_name_title"),
          description: t("displayNameForm_name_subtitle"),
          nextPath: "/home",
          checkField: user?.displayName,
        };
      default:
        return null;
    }
  }, [location.pathname, t, user]);

  useEffect(() => {
    if (config?.checkField) {
      navigate("/home", { replace: true });
    }
  }, [config?.checkField, navigate]);

  const handleSubmit = useCallback(() => {
    if (config) {
      navigate(config.nextPath);
    }
  }, [config, navigate]);

  if (!config) return null;

  return (
    <div className="bg-white">
      <div className="flex flex-col">
        <AuthTitle title={config.title} description={config.description} />

        <DisplayNameForm
          key={config.field}
          field={config.field}
          onChange={handleSubmit}
        />
      </div>
    </div>
  );
}

export default AuthNameFieldPage;
