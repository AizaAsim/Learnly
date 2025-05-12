import { FirebaseError } from "firebase/app";
import { getAdditionalUserInfo, getRedirectResult } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AuthTitle } from "@/components/layout/AuthTitle";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { TextSeparator } from "../../components/ui/text-separator";
import { AuthForm } from "../../features/Auth/components/forms/AuthForm";
import { SSOForm } from "../../features/Auth/components/forms/SSOForm";
import { UserContext } from "../../features/Auth/contexts/UserContext";
import { Role, Roles } from "../../features/Auth/types";
import { auth } from "@/services/firebase";
import { logError } from "../../services/logging";
import { useAuth } from "@/features/Auth/hooks/useAuth";

const AuthPage = () => {
  const [role, setRole] = useState<Roles>(Roles.CREATOR);
  const { t } = useTranslation();
  const context = useContext(UserContext);
  const { createUserDoc } = useAuth();
  const location = useLocation();
  const tab = location.state?.tab;

  useEffect(() => {
    async function handleRedirect(r: Role) {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const details = getAdditionalUserInfo(result);
          if (details?.isNewUser) {
            await createUserDoc(result.user, r);
          }
        }
      } catch (e) {
        logError(e);
        context?.setError((e as FirebaseError).message);
      }
    }
    const localRole = localStorage.getItem("role");
    handleRedirect(localRole as Role).then(() =>
      localStorage.removeItem("role")
    );
  });

  const switchRole = () =>
    setRole((prevRole) =>
      prevRole === Roles.USER ? Roles.CREATOR : Roles.USER
    );

  useEffect(() => {
    if (tab === Roles.CREATOR) setRole(Roles.CREATOR);
    else if (tab === Roles.USER) setRole(Roles.USER);
  }, [tab]);

  return context?.user?.uid && !context?.user?.role ? (
    <Spinner /> // Show a spinner while the user's role is being fetched
  ) : (
    <div className="bg-white">
      <AuthTitle title={t("authPage_title")} />

      <div className="flex flex-col items-stretch">
        <SSOForm role={role} />

        <TextSeparator separator={true}>
          <Trans i18nKey="authPage_separator_text" />
        </TextSeparator>

        <AuthForm role={role} />

        {/* <TosPassiveAcceptance /> */}

        <Button variant="outline" onClick={switchRole} className="mt-4">
          <Trans
            i18nKey={
              role === Roles.USER
                ? "authPage_button_continueAsACreator"
                : "authPage_button_continueAsAFan"
            }
          />
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;
