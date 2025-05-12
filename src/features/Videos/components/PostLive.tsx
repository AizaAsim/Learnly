import { Spinner } from "@/components/ui/spinner";
import {
  selectVideo,
  selectSelectedThumbnail,
} from "@/store/selectors/reelUploadSelectors";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export const PostLive = () => {
  const selectedThumbnail = useSelector(selectSelectedThumbnail);
  const video = useSelector(selectVideo);
  const { user } = useAuth();
  const { closeModal } = useModal();
  const [, copyLink] = useCopyToClipboard();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleCopyLink = async () => {
    const isCopied = await copyLink(
      `${import.meta.env.VITE_BASE_URL}/${user?.username}/${video?.id}`
    );
    if (isCopied)
      toast({
        variant: "success",
        text: t("link_copy"),
      });
    else
      toast({
        variant: "destructive",
        text: "Failed to copy link",
      });
  };

  return (
    <div className="max-w-[327px] md:max-w-[412px] mx-auto flex flex-col items-center gap-4">
      <div>
        {selectedThumbnail ? (
          <img
            src={selectedThumbnail.url}
            className="w-[327px] h-[420px] md:w-[412px] md:h-[480px] object-cover rounded-3xl"
          />
        ) : (
          <div className="w-[327px] h-[420px] md:w-[412px] md:h-[480px]">
            <Spinner />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center w-full gap-4">
        <Button
          onClick={handleCopyLink}
          variant={"secondary"}
          className="w-full h-12 gap-2 font-semibold text-[15px] md:text-base leading-[20px] md:leading-[22px] -tracking-[0.15px] md:-tracking-[0.16px]"
          icon={<img src="/icon/socials/copy-link.svg" className="w-5 h-5" />}
        >
          Copy Link
        </Button>
        <Button onClick={closeModal} variant="ghost" size="none">
          Close
        </Button>
      </div>
    </div>
  );
};
