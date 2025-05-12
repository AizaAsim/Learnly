import { useTranslation } from "react-i18next";
import { publishReel } from "@/features/Videos/services/callable";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { logError } from "@/services/logging";
import { MenuActionButton } from "../HeaderAction";
import { useCurrentReel } from "@/features/Videos/hooks/useCurrentReel";
import { useActionGuard } from "@/features/Videos/hooks/reel-actions/useActionGuard";

const validStates = ["draft", "scheduled"];

export const PublishReel = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reel } = useCurrentReel();
  const { openActionGuard } = useActionGuard();

  async function publish() {
    if (!reel?.id) {
      toast({
        text: "EduClip ID not found",
        variant: "destructive",
      });
      return;
    }
    try {
      await publishReel({ reelId: reel.id });
      navigate(`/my-profile`);
      toast({
        text: "Post published successfully",
        variant: "success",
      });
    } catch (e) {
      logError(e);
      toast({
        text: "Failed to publish reel",
        variant: "destructive",
      });
    }
  }

  const handlePublish = async () => {
    await publish();
    navigate(`/my-profile`);
    onClick();
  };

  const handleAction = () => {
    // Handle invalid states
    if (!validStates.includes(reel?.type as string)) {
      logError("Invalid state for publishing reel", reel);
      toast({
        text: t("videoPlayer_toast_invalid_state"),
        variant: "destructive",
      });
      navigate(`/my-profile`);
      return;
    }
    openActionGuard({
      onConfirm: handlePublish,
      title: t("videoPlayer_guard_publish_title"),
      subtitle: t("videoPlayer_guard_publish_subtitle"),
      confirmText: t("videoPlayer_guard_publish_confirm"),
      confirmVariant: "destructive",
    });
  };

  return (
    <MenuActionButton
      icon="/icon/publish.svg"
      action={handleAction}
      text={t("videoPlayer_menu_btn_publish")}
    />
  );
};
