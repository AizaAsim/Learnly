import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ShareLinkButtons } from "./ShareLinkButtons";
import { logInfo } from "@/services/logging";

export const ShareLink = ({
  handleCopy,
  closeModel,
}: {
  handleCopy: () => void;
  closeModel: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5 mt-[30px]">
      <div className="flex justify-between">
        <ShareLinkButtons
          icon="/icon/socials/copy-link.svg"
          strok="2.33"
          text={t("videoPlayer_text_copyShareLink")}
          action={handleCopy}
        />
        <ShareLinkButtons
          icon="/icon/socials/tiktok.svg"
          strok="0"
          text={t("videoPlayer_text_tiktokShareLink")}
          action={() => {
            logInfo("Tiktok Clicked!");
          }}
        />
        <ShareLinkButtons
          icon="/icon/socials/instagram.svg"
          strok="0"
          text={t("videoPlayer_text_instagramShareLink")}
          action={() => {
            logInfo("Instagram Clicked!");
          }}
        />
        <ShareLinkButtons
          icon="/icon/socials/facebook.svg"
          strok="0"
          text={t("videoPlayer_text_facebookShareLink")}
          action={() => {
            logInfo("Facebook Clicked!");
          }}
        />
        <ShareLinkButtons
          icon="/icon/socials/x.svg"
          strok="0"
          text={t("videoPlayer_text_xShareLink")}
          action={() => {
            logInfo("Twitter Clicked!");
          }}
        />
      </div>
      <Button
        onClick={closeModel}
        variant={"default"}
        className="w-full rounded-xl px-6 py-4 gap-2 h-[50px] bg-grayscale-6 text-grayscale-100 hover:text-white"
      >
        {t("videoPlayer_text_closeShareLink")}
      </Button>
    </div>
  );
};
