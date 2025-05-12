import { useTranslation } from "react-i18next";
import { MenuActionButton } from "../HeaderAction";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { firestore } from "@/services/firebase";
import { deleteField, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useCurrentReel } from "@/features/Videos/hooks/useCurrentReel";
import { toast } from "@/components/ui/use-toast";
import { logError } from "@/services/logging";
import { AppDispatch } from "@/store";
import { useNavigate } from "react-router-dom";
import { deleteReel } from "@/store/reducers/myVideosReducer";
import { useActionGuard } from "@/features/Videos/hooks/reel-actions/useActionGuard";

const validStates = ["draft", "scheduled", "active", "archived"];

export const DeleteReel = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { reel } = useCurrentReel();
  const { openActionGuard } = useActionGuard();

  const deleteCreatorReel = useCallback(async () => {
    if (!reel) return;
    try {
      // delete the archivedAt field and set the type to draft in Firestore
      const dateAsSeconds = Math.floor(Date.now() / 1000);
      const timestamp = new Timestamp(dateAsSeconds, 0);

      const reelDoc = doc(firestore, `reels/${reel.id}`);
      await updateDoc(reelDoc, {
        archivedAt: deleteField(),
        publishedAt: deleteField(),
        scheduledAt: deleteField(),
        deletedAt: timestamp,
        type: "deleted",
      });
      // match the local state with the Firestore state
      dispatch(deleteReel(reel.id));
      toast({
        text: t("videoPlayer_toast_delete_success"),
        variant: "success",
      });
    } catch (error) {
      logError(error);
      toast({
        text: t("videoPlayer_toast_delete_error"),
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [dispatch, reel, t]);

  const handleDelete = async () => {
    await deleteCreatorReel();
    navigate("/my-profile");
    onClick(); // Closes reel menu
  };

  // Open a confirmation modal before deleting the reel
  const handleAction = () => {
    // Handle invalid states
    if (!validStates.includes(reel?.type as string)) {
      logError("Invalid state for deleting reel", reel);
      toast({
        text: t("videoPlayer_toast_invalid_state"),
        variant: "destructive",
      });
      navigate(`/my-profile`);
      return;
    }
    openActionGuard({
      onConfirm: handleDelete,
      title: t("videoPlayer_guard_delete_title"),
      subtitle: t("videoPlayer_guard_delete_subtitle"),
      confirmText: t("videoPlayer_guard_delete_confirm"),
      cancelText: t("videoPlayer_guard_default_cancel"),
    });
  };

  return (
    <MenuActionButton
      className="text-red-500 hover:text-red-400 active:text-red-400"
      icon="/icon/delete_outlined.svg"
      action={handleAction}
      text={t("videoPlayer_menu_btn_delete")}
    />
  );
};
