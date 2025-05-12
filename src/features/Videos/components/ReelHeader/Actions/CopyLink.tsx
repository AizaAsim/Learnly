import { useTranslation } from "react-i18next";
import { useCopyShareableLink } from "@/features/Videos/hooks/reel-actions/useCopyShareableLink";
import { MenuActionButton } from "../HeaderAction";

export const CopyLink = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { copyShareableLink } = useCopyShareableLink();

  return (
    <MenuActionButton
      icon="/icon/link-white.svg"
      action={() => {
        copyShareableLink();
        onClick();
      }}
      text={t("videoPlayer_text_copyShareLink")}
    />
  );
};
