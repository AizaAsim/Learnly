import { useToast } from "@/components/ui/use-toast";
import { logInfo } from "@/services/logging";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useCurrentReel } from "../useCurrentReel";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export function useCopyShareableLink() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { url: currentUrl } = useCurrentReel();
  const [, copyLink] = useCopyToClipboard();

  const copyShareableLink = useCallback(
    async (url: string = currentUrl) => {
      const isCopied = await copyLink(url);

      if (isCopied) {
        toast({
          text: t("videoPlayer_text_linkCopy"),
          variant: "blur",
        });
      } else {
        logInfo("Failed to copy to clipboard");
        toast({
          text: t("videoPlayer_toast_link_copy_failed"),
          variant: "destructive",
        });
      }
    },
    [currentUrl, copyLink, toast, t]
  );

  return {
    copyShareableLink,
    currentUrl,
  };
}
