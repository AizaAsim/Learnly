import { useModal } from "@/hooks/useModal";
import { useCallback } from "react";
import { SuccessfulUnsubscribeModal } from "../components/SuccessfulUnsubscribeModal";
import { selectCreatorProfileData } from "@/store/selectors/creatorProfileSelectors";
import { useSelector } from "react-redux";
import { FirebaseTimestamp } from "@/types";

export const useSuccessfulUnsubscribeModal = () => {
  const { setModal, closeModal, openModal } = useModal();
  const creatorProfile = useSelector(selectCreatorProfileData);

  const openSuccessfulUnsubscribeModal = useCallback(
    (expirationDate: FirebaseTimestamp) => {
      setModal(
        <SuccessfulUnsubscribeModal
          onConfirm={() => closeModal()}
          expirationDate={expirationDate}
        />,
        {
          avatar: {
            imageUrl: creatorProfile?.avatar_url || undefined,
            icon: "/icon/cross-circular-red.svg",
          },
        }
      );
      openModal();
    },
    [setModal, openModal, closeModal, creatorProfile?.avatar_url]
  );

  return { openSuccessfulUnsubscribeModal };
};
