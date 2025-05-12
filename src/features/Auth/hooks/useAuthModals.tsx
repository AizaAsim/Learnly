import { useModal } from "@/hooks/useModal";
import { useCallback, useRef } from "react";
import { AuthView } from "../components/views/AuthView";
import { AuthVerificationView } from "../components/views/AuthVerificationView";
import { selectCreatorProfileData } from "@/store/selectors/creatorProfileSelectors";
import { useSelector } from "react-redux";
import { AuthTitle } from "@/components/layout/AuthTitle";
import { Trans, useTranslation } from "react-i18next";
import { DisplayNameForm } from "../components/forms/DisplayNameForm";
import { NamesFields } from "../types";

interface ModalFunctions {
  openAuthModal: () => void;
  openAuthVerificationModal: (email: string) => void;
  openNameModal: () => void;
}

export const useAuthModals = (): ModalFunctions => {
  const { openModal, setModal, closeModal } = useModal();
  const { t } = useTranslation();
  const profileData = useSelector(selectCreatorProfileData);

  const functionsRef = useRef<Partial<ModalFunctions>>({});

  const openAuthModal = useCallback(() => {
    setModal(<AuthView />, {
      title: (
        <AuthTitle
          title={t("authView_title")}
          description={
            <Trans
              i18nKey={"authView_description"}
              components={{
                strong: (
                  <span className="text-ellipsis whitespace-nowrap overflow-hidden font-semibold" />
                ),
              }}
              values={{ name: profileData?.displayName }}
            />
          }
          containerClassName="mb-0"
        />
      ),
      sheetTitleClassNames: "px-0",
      avatar: {
        imageUrl: profileData?.avatar_url || "/img/avatar.png",
        icon: "/icon/subscribe-circular-star.svg",
      },
    });
    openModal();
  }, [
    openModal,
    profileData?.avatar_url,
    profileData?.displayName,
    setModal,
    t,
  ]);

  const openAuthVerificationModal = useCallback(
    async (email: string) => {
      setModal(
        <AuthVerificationView email={email} />,
        {
          title: (
            <AuthTitle
              title={t("authVerificationPage_title")}
              description={
                <Trans
                  i18nKey={"authVerificationPage_description"}
                  components={{
                    strong: <span className="font-semibold" />,
                  }}
                  values={{ email }}
                />
              }
              containerClassName="mb-0"
            />
          ),
          sheetTitleClassNames: "px-0",
        },
        { showBackIcon: true, onBackClick: functionsRef.current.openAuthModal }
      );
      openModal();
    },
    [openModal, setModal, t]
  );

  const openNameModal = useCallback(() => {
    setModal(
      <DisplayNameForm field={NamesFields.displayName} onChange={closeModal} />,
      {
        title: t("displayNameForm_name_title"),
        subtitle: t("displayNameForm_name_subtitle"),
      }
    );
    openModal();
  }, [setModal, closeModal, t, openModal]);

  // Update the ref with the latest function references
  functionsRef.current = {
    openAuthModal,
    openNameModal,
  };

  return {
    openAuthModal,
    openAuthVerificationModal,
    openNameModal,
  };
};
