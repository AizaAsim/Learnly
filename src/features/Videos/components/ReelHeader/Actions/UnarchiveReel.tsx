import { useTranslation } from "react-i18next";
import { MenuActionButton } from "../HeaderAction";
import { useCallback } from "react";
import { useCurrentReel } from "@/features/Videos/hooks/useCurrentReel";
import { firestore } from "@/services/firebase";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { updateReel } from "@/store/reducers/myVideosReducer";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { logError } from "@/services/logging";
import { useNavigate } from "react-router-dom";
import { useActionGuard } from "@/features/Videos/hooks/reel-actions/useActionGuard";

const validStates = ["archived"];

export const UnarchiveReel = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { reel } = useCurrentReel();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openActionGuard } = useActionGuard();

  const unarchiveReel = useCallback(async () => {
    if (!reel) return;
    try {
      // delete the archivedAt field and set the type to draft in Firestore
      const reelDoc = doc(firestore, `reels/${reel.id}`);
      await updateDoc(reelDoc, {
        type: "draft",
        archivedAt: deleteField(),
        publishedAt: deleteField(),
        scheduledAt: deleteField(),
      });

      // match the local state with the Firestore state
      const updated = {
        id: reel.id,
        data: {
          ...reel,
          type: "draft",
          archivedAt: undefined,
          publishedAt: undefined,
          scheduledAt: undefined,
        },
      };
      dispatch(updateReel(updated));
      toast({
        text: t("videoPlayer_toast_unarchive_success"),
        variant: "success",
      });
    } catch (error) {
      logError(error);
      toast({
        text: t("videoPlayer_toast_unarchive_error"),
        variant: "destructive",
      });
    }
  }, [dispatch, reel, t]);

  const handleArchive = async () => {
    await unarchiveReel();
    navigate(`/my-profile`);
    onClick();
  };

  const handleAction = () => {
    // Handle invalid states
    if (!validStates.includes(reel?.type as string)) {
      logError("Invalid state for unarchiving reel", reel);
      toast({
        text: t("videoPlayer_toast_invalid_state"),
        variant: "destructive",
      });
      navigate(`/my-profile`);
      return;
    }
    openActionGuard({
      onConfirm: handleArchive,
      title: t("videoPlayer_guard_unarchive_title"),
      subtitle: t("videoPlayer_guard_unarchive_subtitle"),
      confirmText: t("videoPlayer_guard_unarchive_confirm"),
      cancelText: t("videoPlayer_guard_default_cancel"),
      confirmVariant: "default",
    });
  };

  return (
    <MenuActionButton
      icon="/icon/unarchive.svg"
      action={handleAction}
      text={t("videoPlayer_menu_btn_unarchive")}
    />
  );
};
