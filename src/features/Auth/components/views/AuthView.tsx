import { TextSeparator } from "@/components/ui/text-separator";
import { AuthViewForm } from "@/features/Auth/components/forms/AuthViewForm";
import { SSOForm } from "@/features/Auth/components/forms/SSOForm";
import { Roles } from "@/features/Auth/types";
import { Trans } from "react-i18next";
import { TosPassiveAcceptance } from "../TosPassiveAcceptance";

export const AuthView = () => {
  return (
    <>
      <SSOForm role={Roles.USER} />
      <TextSeparator separator={true}>
        <Trans i18nKey="authPage_separator_text" />
      </TextSeparator>
      <AuthViewForm />
      <TosPassiveAcceptance />
    </>
  );
};