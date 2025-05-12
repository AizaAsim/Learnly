import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { Trans } from "react-i18next";
import { LegalInfoType } from "../types";
import { logError } from "@/services/logging";

interface LegalInfoPopupProps {
  type: LegalInfoType;
}

export const LegalInfoPopup = ({ type }: LegalInfoPopupProps) => {
  const handleViewLegalInfo = useCallback(() => {
    const tosUrl = import.meta.env.BASE_URL; // TODO: REPLACE WITH HOSTED TERMS OF SERVICE URL
    const privacyUrl = import.meta.env.BASE_URL; // TODO: REPLACE WITH HOSTED PRIVACY POLICY URL

    switch (type) {
      case LegalInfoType.TOS:
        window.location.href = tosUrl;
        break;
      case LegalInfoType.PRIVACY:
        window.location.href = privacyUrl;
        break;
      default:
        logError("Unhandled legal information type:", type);
        break;
    }
  }, [type]);

  return (
    <>
      <Button
        variant="default"
        onClick={handleViewLegalInfo}
        className="w-full"
      >
        <Trans
          i18nKey={
            type === LegalInfoType.TOS
              ? "legalInfo_button_tos"
              : "legalInfo_button_privacy"
          }
        />
      </Button>
    </>
  );
};
