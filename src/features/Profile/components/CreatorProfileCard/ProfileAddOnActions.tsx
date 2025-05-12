import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { AddBio } from "./AddBio";
import { addBio } from "@/store/reducers/creatorProfileReducer";
import { AddSocials } from "./AddSocials";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

type AddOnType = "bio" | "socials";

interface BaseProfileAddOnActionsProps {
  addOnType: AddOnType;
}

interface BioAddOnProps extends BaseProfileAddOnActionsProps {
  addOnType: "bio";
  bio: string | null;
}

interface SocialsAddOnProps extends BaseProfileAddOnActionsProps {
  addOnType: "socials";
  connectedSocials: { name: string }[];
  setConnectedSocials: Dispatch<SetStateAction<{ name: string }[]>>;
}

type ProfileAddOnActionsProps = BioAddOnProps | SocialsAddOnProps;

export const ProfileAddOnActions = (props: ProfileAddOnActionsProps) => {
  const { setModal, openModal } = useModal();
  const { t } = useTranslation();

  const openBioModal = useCallback(() => {
    if (props.addOnType === "bio") {
      setModal(
        <AddBio
          onSave={(bio) => {
            if (bio) addBio(bio);
          }}
        />,
        {
          title: t("profileAddBio.title"),
          subtitle: t("profileAddBio.subtitle"),
        }
      );
      openModal();
    }
  }, [props.addOnType, setModal, t, openModal]);

  const openSocialsModal = useCallback(() => {
    if (props.addOnType === "socials") {
      setModal(<AddSocials onSave={props.setConnectedSocials} />, {
        title: t("social_account_title"),
        subtitle: t("social_account_description"),
      });
      openModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.addOnType, setModal, openModal, props]);

  if (props.addOnType === "bio" && !props.bio) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={openBioModal}
        className={cn(classes.button)}
      >
        + add a bio
      </Button>
    );
  }

  if (props.addOnType === "socials" && !props.connectedSocials.length) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={openSocialsModal}
        className={cn(classes.button)}
      >
        + connect socials
      </Button>
    );
  }

  return null;
};

const classes = {
  button: [
    "h-auto flex items-center py-2 pr-3 pl-2.5 md:px-3 md:py-1.5 rounded-[20px] bg-dark-T4 backdrop-blur-2xl",
    "font-semibold text-dark-T60 text-[13px] md:text-[15px] leading-4 md:leading-5 -tracking-[0.195px] md:-tracking-[0.225px]",
  ],
};
