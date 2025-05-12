import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import {
  makeReelTypeCancel,
  resetUpload,
} from "@/store/reducers/reelUploadReducer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

interface DiscordPostProps {
  onCancel: () => void;
}

export const DiscardPost = ({ onCancel }: DiscordPostProps) => {
  const { closeModal, setOnCloseModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleDiscard = async () => {
    dispatch(makeReelTypeCancel());
    dispatch(resetUpload());
    setOnCloseModal(undefined);
    closeModal();
  };

  useEffect(() => {
    setOnCloseModal(onCancel);
  }, [onCancel, setOnCloseModal]);

  const handleCancel = () => onCancel();

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex flex-col gap-1 w-[311px] mx-auto">
        <Button
          variant="destructive"
          onClick={handleDiscard}
          className="text-[15px] md:text-base font-semibold leading-5 md:leading-[22px]"
        >
          {t("reelUpload_button_discard")}
        </Button>
        <Button
          variant="ghost"
          size="none"
          onClick={handleCancel}
          className="mt-3"
        >
          {t("reelUpload_button_cancel")}
        </Button>
      </div>
    </div>
  );
};
