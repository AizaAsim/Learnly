import { BackButtonOptions, ContentOptions } from "@/contexts/ModalContext";
import { useModal } from "@/hooks/useModal";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ReviewReel } from "../components/ReviewReel";
import { VideoUpload } from "../components/VideoUpload";
import { EditReelDetails } from "../components/EditReelDetails";
import { ChooseDate } from "../components/ChooseDate";
import { ChooseTime } from "../components/ChooseTime";
import { PostLive } from "../components/PostLive";
import { DiscardPost } from "../components/DiscardPost";
import {
  makeReelTypeCancel,
  resetUpload,
} from "@/store/reducers/reelUploadReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { VideoCover } from "../components/VideoCover";

const useModalWithDefaults = () => {
  const { setModal, setOnCloseModal } = useModal();

  const openModal = (
    content: ReactNode,
    options: ContentOptions,
    backOptions?: BackButtonOptions,
    onClose?: () => void
  ) => {
    const {
      sheetTitleClassNames,
      sheetContentClassNames,
      dialogTitleClassNames,
      dialogContentClassNames,
      ...otherOptions
    } = options;
    const defaultOptions: ContentOptions = {
      // "text-center font-bold text-xl mb-[30px]",
      sheetTitleClassNames: sheetTitleClassNames,
      sheetContentClassNames: sheetContentClassNames,
      dialogContentClassNames: dialogContentClassNames,
      dialogTitleClassNames: dialogTitleClassNames,
      ...otherOptions,
    };
    setOnCloseModal(onClose);
    setModal(content, defaultOptions, backOptions);
  };
  return openModal;
};

export const useVideoUploadModals = () => {
  const { t } = useTranslation();
  const openModal = useModalWithDefaults();
  const { setIsOpen } = useModal();
  const dispatch = useDispatch<AppDispatch>();

  const openFilePicker = () =>
    openModal(
      <VideoUpload onUploadSuccess={openReviewReel} />,
      {
        title: t("reelUpload_modal_text_title"),
        sheetTitleClassNames: "normal-case",
        dialogTitleClassNames: "normal-case",
      },
      undefined,
      async () => {
        dispatch(makeReelTypeCancel());
        dispatch(resetUpload());
        setIsOpen(false);
      }
    );

  const openReviewReel = () => {
    openModal(
      <ReviewReel />,
      {
        title: t("reelUpload_modal_text_title"),
        sheetTitleClassNames: "normal-case",
        dialogTitleClassNames: "normal-case",
      },
      undefined,
      () => openDiscardPost(openReviewReel)
    );
  };

  const openEditReelDetails = () => {
    openModal(
      <EditReelDetails />,
      {
        title: t("reelUpload_addDetails_title"),
      },
      {
        showBackIcon: true,
        onBackClick: openReviewReel,
      },
      () => openDiscardPost(openEditReelDetails)
    );
  };

  const openChooseDate = () => {
    openModal(
      <ChooseDate onNext={openChooseTime} />,
      {
        title: t("reelUpload_chooseDate_title"),
      },
      {
        showBackIcon: true,
        onBackClick: openEditReelDetails,
      },
      () => openDiscardPost(openChooseDate)
    );
  };

  const openVideoCover = () => {
    openModal(
      <VideoCover />,
      {
        title: t("reelUpload_editCover"),
      },
      {
        showBackIcon: true,
        onBackClick: openReviewReel,
      },
      () => openDiscardPost(openVideoCover)
    );
  };

  const openChooseTime = () => {
    openModal(
      <ChooseTime
        onNext={openEditReelDetails}
        buttonText={t("reelUpload_button_schedule")}
      />,
      {
        title: t("reelUpload_chooseTime_title"),
      },
      {
        showBackIcon: true,
        onBackClick: openChooseDate,
      },
      () => openDiscardPost(openChooseTime)
    );
  };

  const openPostLive = () => {
    openModal(
      <PostLive />,
      {
        title: t("reelUpload_postLive_title"),
      },
      undefined,
      () => {
        dispatch(resetUpload());
        setIsOpen(false);
      }
    );
  };

  const openDiscardPost = (onCancel: () => void) => {
    openModal(
      <DiscardPost onCancel={onCancel} />,
      {
        title: t("reelUpload_discardPost_title"),
        subtitle: t("reelUpload_discardPost_subtitle"),
      },
      undefined,
      openEditReelDetails
    );
  };

  return {
    openFilePicker,
    openReviewReel,
    openEditReelDetails,
    openChooseDate,
    openChooseTime,
    openPostLive,
    openDiscardPost,
    openVideoCover,
  };
};
