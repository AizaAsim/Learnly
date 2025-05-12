import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { router } from "@/router";
import { AppDispatch } from "@/store";
import {
  fetchCreatorProfile,
  fetchCreatorVideos,
} from "@/store/reducers/creatorProfileReducer";
import { selectCreatorProfileData } from "@/store/selectors/creatorProfileSelectors";
import { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export const useSubscriptionResumedModal = () => {
  const creatorProfile = useSelector(selectCreatorProfileData);
  const { setModal, openModal, closeModal } = useModal();
  const { t } = useTranslation(undefined, {
    keyPrefix: "successful_resume_subscription",
  });
  const dispatch = useDispatch<AppDispatch>();

  const handleViewProfile = useCallback(() => {
    const username = creatorProfile?.username;
    if (username) {
      router.navigate(`/${username}`);
      dispatch(fetchCreatorVideos(username));
      dispatch(fetchCreatorProfile(username));
    }
    closeModal();
  }, [creatorProfile?.username, closeModal, dispatch]);

  const ViewProfileButton = useMemo(
    () => (
      <Button
        variant="secondary"
        className="w-full max-w-[375px] md:max-w-[443px] mx-auto block"
        onClick={handleViewProfile}
      >
        {t("button")}
      </Button>
    ),
    [t, handleViewProfile]
  );

  const openSuccessfulSubscriptionResumedModal = useCallback(() => {
    setModal(ViewProfileButton, {
      title: t("headline"),
      subtitle: (
        <Trans
          i18nKey="successful_resume_subscription.description"
          values={{
            creatorName:
              creatorProfile?.displayName ||
              creatorProfile?.username ||
              "Educator",
          }}
          components={{ strong: <span className="font-semibold" /> }}
        />
      ),
      sheetSubTitleClassNames: "max-w-[375px] md:max-w-[443px] mx-auto",
      dialogSubTitleClassNames: "max-w-[375px] md:max-w-[443px] mx-auto",
    });
    openModal();
  }, [setModal, openModal, t, creatorProfile, ViewProfileButton]);

  return { openSuccessfulSubscriptionResumedModal };
};
