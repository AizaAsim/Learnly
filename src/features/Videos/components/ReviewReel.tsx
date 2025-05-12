import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  makeReelTypeCancel,
  resetUpload,
} from "@/store/reducers/reelUploadReducer";
import { useDispatch, useSelector } from "react-redux";
import { useThumbnail } from "../hooks/useThumbnail";
import { useVideoUploadModals } from "../hooks/useVideoUploadModals";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "@/store";
import { selectUploadId } from "@/store/selectors/reelUploadSelectors";
import { router } from "@/router";
import { useModal } from "@/hooks/useModal";

interface BadgeButtonProps extends BadgeProps {
  iconSrc: string;
}

const BadgeButton = ({ iconSrc, children, ...props }: BadgeButtonProps) => {
  return (
    <Badge
      className="text-[13px] gap-1.5 pl-2.5 pr-3 py-2 bg-light-T24 backdrop-blur-2xl font-semibold hover:bg-light-T30 active:bg-light-T30 focus:bg-light-T30 cursor-pointer select-none -tracking-[0.195px] leading-4 text-light-T90 max-w-max mx-auto"
      {...props}
    >
      <img src={iconSrc} className="h-4 w-4" />
      {children}
    </Badge>
  );
};

export const ReviewReel = () => {
  const draftId = useSelector(selectUploadId);
  const dispatch = useDispatch<AppDispatch>();
  const { openEditReelDetails, openFilePicker, openVideoCover } =
    useVideoUploadModals();
  const { selectedThumbnail } = useThumbnail();
  const { t } = useTranslation();
  const { closeModal, setOnCloseModal } = useModal();

  const handleChangeReel = async () => {
    dispatch(makeReelTypeCancel());
    dispatch(resetUpload());
    openFilePicker();
  };

  const handlePreview = () => {
    setOnCloseModal(undefined);
    closeModal();
    router.navigate(`/preview/${draftId}`);
  };

  return (
    <div className="flex flex-col gap-4 max-w-[327px] md:max-w-auto mx-auto">
      <div className="relative">
        {selectedThumbnail ? (
          <>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-3">
              <BadgeButton
                iconSrc="/icon/thumbnail.svg"
                onClick={openVideoCover}
              >
                {t("reelUpload_button_edit_cover")}
              </BadgeButton>
              <BadgeButton iconSrc="/icon/eye.svg" onClick={handlePreview}>
                {t("reelUpload_button_preview")}
              </BadgeButton>
            </div>
            <img
              src={selectedThumbnail.url}
              className="w-[327px] h-[440px] object-cover rounded-3xl bg-gradient-to-tr from-grayscale-40 to-grayscale-50"
            />
          </>
        ) : (
          <div className="w-[327px] h-[440px] rounded-3xl bg-gradient-to-tr from-grayscale-40 to-grayscale-50 animate-pulse">
            <Spinner />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <Button onClick={openEditReelDetails}>
          {t("reelUpload_button_next")}
        </Button>
        <Button variant="ghost" size="none" onClick={handleChangeReel}>
          {t("reelUpload_button_changeReel")}
        </Button>
      </div>
    </div>
  );
};
