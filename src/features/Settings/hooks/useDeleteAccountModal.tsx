import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Roles } from "@/features/Auth/types";
import { useModal } from "@/hooks/useModal";
import { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { DeleteAccount } from "../components/DeleteAccount";

export const useDeleteAccountModal = () => {
  const { user } = useAuth();
  const { setModal, openModal } = useModal();
  const { t } = useTranslation(undefined, { keyPrefix: "deleteAccount" });

  const subtitle = useMemo(
    () => (
      <Trans
        i18nKey={
          user?.role === Roles.CREATOR
            ? "deleteAccount.subtitle_creator"
            : "deleteAccount.subtitle_user"
        }
        components={{
          underline: (
            <a className="text-grayscale-80 underline font-semibold underline-offset-4"></a>
          ),
        }}
      />
    ),
    [user]
  );

  const openDeleteAccountModal = useCallback(() => {
    setModal(<DeleteAccount />, {
      title: t("title"),
      subtitle,
      sheetSubTitleClassNames: "max-w-[327px] mx-auto",
    });
    openModal();
  }, [setModal, openModal, t, subtitle]);

  return { openDeleteAccountModal };
};
