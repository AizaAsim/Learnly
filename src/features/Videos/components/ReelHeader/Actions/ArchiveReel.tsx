import { useTranslation } from "react-i18next";
import { MenuActionButton } from "../HeaderAction";
import { useCallback } from "react";
import { useCurrentReel } from "@/features/Videos/hooks/useCurrentReel";
import { firestore } from "@/services/firebase";
import { deleteField, doc, Timestamp, updateDoc } from "firebase/firestore";
import { updateReel } from "@/store/reducers/myVideosReducer";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useActionGuard } from "@/features/Videos/hooks/reel-actions/useActionGuard";
import { logError } from "@/services/logging";
import { useModal } from "@/hooks/useModal";
import { ArchivedLimitReached } from "../../ArchivedLimitReached";
import { useUploadLimits } from "@/features/Videos/hooks/useUploadLimits";

const validStates = ["draft", "scheduled", "active"];

export const ArchiveReel = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { reel } = useCurrentReel();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openActionGuard } = useActionGuard();
  const { setModal, openModal } = useModal();
  const { archivedUnderLimit } = useUploadLimits();

  const openArchivedLimitReachedModal = useCallback(() => {
    setTimeout(() => {
      setModal(<ArchivedLimitReached />, {
        title: t("videoPlayer_guard_archived_limit_reached_title"),
        subtitle: t("videoPlayer_guard_archived_limit_reached_subtitle"),
      });
      openModal();
    }, 0);
  }, [openModal, setModal, t]);

  const archiveReel = useCallback(async () => {
    if (!reel) return;
    try {
      const dateAsSeconds = Math.floor(Date.now() / 1000);
      const timestamp = new Timestamp(dateAsSeconds, 0);

      const reelDoc = doc(firestore, `reels/${reel.id}`);
      await updateDoc(reelDoc, {
        archivedAt: timestamp,
        publishedAt: deleteField(),
        scheduledAt: deleteField(),
        type: "archived",
      });
      const updated = {
        id: reel.id,
        data: {
          ...reel,
          archivedAt: { _seconds: dateAsSeconds, _nanoseconds: 0 },
          publishedAt: undefined,
          scheduledAt: undefined,
          type: "archived",
        },
      };
      dispatch(updateReel(updated));
      toast({
        text: t("videoPlayer_toast_archive_success"),
        variant: "success",
      });
    } catch (error) {
      toast({
        text: t("videoPlayer_toast_archive_error"),
        variant: "destructive",
      });
    }
  }, [dispatch, reel, t]);

  const handleArchive = async () => {
    if (!archivedUnderLimit) {
      openArchivedLimitReachedModal();
    } else {
      await archiveReel();
      navigate(`/my-profile`);
      onClick();
    }
  };

  const handleAction = () => {
    if (!validStates.includes(reel?.type as string)) {
      logError("Invalid state for archiving reel", reel);
      toast({
        text: t("videoPlayer_toast_invalid_state"),
        variant: "destructive",
      });
      navigate(`/my-profile`);
      return;
    }
    openActionGuard({
      onConfirm: handleArchive,
      title: t("videoPlayer_guard_archive_title"),
      subtitle: t("videoPlayer_guard_archive_subtitle"),
      confirmText: t("videoPlayer_guard_archive_confirm"),
      cancelText: t("videoPlayer_guard_default_cancel"),
      confirmVariant: "default",
    });
  };

  return (
    <MenuActionButton
      icon="/icon/archive.svg"
      action={handleAction}
      text={t("videoPlayer_menu_btn_archive")}
    />
  );
};
