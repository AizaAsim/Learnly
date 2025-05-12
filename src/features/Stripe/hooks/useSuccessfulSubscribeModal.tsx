import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useModal } from "@/hooks/useModal";
import { selectCreatorProfileData } from "@/store/selectors/creatorProfileSelectors";
import { Button } from "@/components/ui/button";

export const useSuccessfulSubscribeModal = () => {
  const { setModal, closeModal, openModal } = useModal();
  const creatorProfile = useSelector(selectCreatorProfileData);
  const navigate = useNavigate();
  const { t } = useTranslation(undefined, {
    keyPrefix: "successful_subscription",
  });

  const subtitle = useMemo(
    () => (
      <Trans
        i18nKey="successful_subscription.description"
        values={{ creatorName: creatorProfile?.displayName }}
        components={{ strong: <span className="font-semibold" /> }}
      />
    ),
    [creatorProfile?.displayName]
  );

  const button = useMemo(
    () => (
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {
          if (creatorProfile?.username) navigate(`/${creatorProfile.username}`);
          closeModal();
        }}
      >
        {t("button")}
      </Button>
    ),
    [creatorProfile?.username, navigate, closeModal, t]
  );

  const openSuccessfulSubscribeModal = useCallback(() => {
    setModal(button, {
      title: t("headline"),
      subtitle,
      avatar: {
        imageUrl: creatorProfile?.avatar_url || undefined,
        icon: "/icon/checkmark-green-fill.svg",
      },
    });
    openModal();
  }, [button, subtitle, t, creatorProfile?.avatar_url, setModal, openModal]);

  return { openSuccessfulSubscribeModal };
};
