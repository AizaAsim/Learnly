import { useModal } from "@/hooks/useModal";
import { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { PostRemoved } from "../components/PostRemoved";
import { PostRestored } from "../components/PostRestored";
import { PostDeleted } from "../components/PostDeleted";

export const usePostNotificationModals = () => {
  const { setModal, openModal } = useModal();
  const { t } = useTranslation();

  const openPostRemovedModal = useCallback(() => {
    setModal(<PostRemoved />, {
      title: t("post_removed.headline"),
      subtitle: (
        <Trans
          i18nKey="post_removed.description"
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
    });
    openModal();
  }, [setModal, openModal, t]);

  const openPostRestoredModal = useCallback(() => {
    setModal(<PostRestored />, {
      title: t("post_restored.headline"),
      subtitle: t("post_restored.description"),
      sheetHeaderClassNames: "mb-3.5",
      sheetSubTitleClassNames: "max-w-[327px] mx-auto",
    });
    openModal();
  }, [setModal, openModal, t]);

  const openPostDeletedModal = useCallback(() => {
    setModal(<PostDeleted />, {
      title: t("post_deleted.headline"),
      subtitle: (
        <Trans
          i18nKey="post_deleted.description"
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
      sheetHeaderClassNames: "mb-3.5",
      sheetSubTitleClassNames: "max-w-[327px] mx-auto",
    });
    openModal();
  }, [setModal, openModal, t]);

  return { openPostRemovedModal, openPostRestoredModal, openPostDeletedModal };
};
