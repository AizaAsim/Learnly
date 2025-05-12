import { useModal } from "@/hooks/useModal";
import { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { SubmitAppeal } from "../components/SubmitAppeal";
import { Button } from "@/components/ui/button";
import { usePostNotificationModals } from "./usePostNotificationModals";

export const useSubmitAppealModals = () => {
  const { setModal, openModal, closeModal } = useModal();
  const { openPostRemovedModal } = usePostNotificationModals();
  const { t } = useTranslation();

  const openSubmitAppealModal = useCallback(() => {
    setModal(
      <SubmitAppeal />,
      {
        title: t("submit_appeal.headline"),
        subtitle: (
          <Trans
            i18nKey="submit_appeal.description"
            components={{
              underline: (
                <a
                  className="underline font-semibold text-grayscale-80"
                  href="#"
                />
              ),
            }}
          />
        ),
        sheetHeaderClassNames: "mb-[18px]",
        sheetSubTitleClassNames: "max-w-[327px] mx-auto",
      },
      { onBackClick: openPostRemovedModal, showBackIcon: true }
    );
    openModal();
  }, [setModal, openModal, t, openPostRemovedModal]);

  const openAppealSubmittedModal = useCallback(() => {
    setModal(
      <div className="w-full">
        <Button
          onClick={closeModal}
          className="max-w-[327px] md:max-w-full w-full mx-auto block"
        >
          {t("appeal_submitted.button")}
        </Button>
      </div>,
      {
        title: t("appeal_submitted.headline"),
        subtitle: t("appeal_submitted.description"),
        sheetSubTitleClassNames: "max-w-[327px] md:max-w-full mx-auto",
      }
    );
    openModal();
  }, [setModal, openModal, closeModal, t]);

  return { openSubmitAppealModal, openAppealSubmittedModal };
};
