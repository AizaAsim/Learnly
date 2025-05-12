import { useTranslation } from "react-i18next";

export const TosPassiveAcceptance = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center mt-3 mb-6">
      <span className="font-medium text-xs leading-4 text-dark-T50 -tracking-[0.12px] text-center">
        {t("authPage_text_terms_fragment_1", "By continuing, you agree to our")}
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/80 underline hover:text-black focus:ring-2 focus:ring-offset-2 focus:outline-none mx-1"
          aria-label={t("authPage_text_terms_of_service", "Terms of Service")}
        >
          {t("authPage_text_terms_of_service", "Terms of Service")}
        </a>
        {t("authPage_text_terms_fragment_2", "and")}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/80 underline hover:text-black focus:ring-2 focus:ring-offset-2 focus:outline-none mx-1"
          aria-label={t("authPage_text_privacy_policy", "Privacy Policy")}
        >
          {t("authPage_text_privacy_policy", "Privacy Policy")}
        </a>
        {t("authPage_text_terms_fragment_3", ".")}
      </span>
    </div>
  );
};
