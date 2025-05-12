import { useCallback, useState, useEffect, useRef } from "react";
import { checkUserAgreed, saveUserAgreement } from "../services/callable";
import { useModal } from "@/hooks/useModal";
import { useTranslation } from "react-i18next";
import { LegalInfoPopup } from "@/features/Auth/components/LegalInfoPopup";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { LegalInfoType } from "@/features/Auth/types";

export function useLatestTerms() {
  const [userAgreedToLatestTos, setUserAgreedToLatestTos] =
    useState<boolean>(true);

  const { user } = useAuth();
  const { t } = useTranslation();
  const { setModal, openModal, closeModal, isOpen } = useModal();

  const location = useLocation();
  const pathRef = useRef("");

  const checkUserAgreedToLatestTos = useCallback(async () => {
    if (pathRef.current === location.pathname) return;
    const { data } = await checkUserAgreed();
    setUserAgreedToLatestTos(data);
  }, [location.pathname]);

  const saveUserLatestAgreement = useCallback(async () => {
    const { data } = await saveUserAgreement();
    setUserAgreedToLatestTos(data);
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (!userAgreedToLatestTos) {
      saveUserLatestAgreement();
      setModal(<LegalInfoPopup type={LegalInfoType.TOS} />, {
        title: t("legalInfo_text_tos_title"),
        subtitle: t("legalInfo_text_tos_description"),
      });
      openModal();
    }
  }, [
    t,
    userAgreedToLatestTos,
    isOpen,
    setModal,
    closeModal,
    openModal,
    saveUserLatestAgreement,
  ]);

  useEffect(() => {
    if (!user?.uid) return;
    checkUserAgreedToLatestTos();
  }, [checkUserAgreedToLatestTos, user]);

  return { userAgreedToLatestTos };
}
