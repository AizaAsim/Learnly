import { Label } from "@radix-ui/react-label";
import CoinSvg from "../../../../public/icon/Coin.svg";
import { useTranslation } from "react-i18next";

export const Tip = ({ action }: { action: () => void }) => {
  const { t } = useTranslation();
  return (
    <div
      className="bg-white/20 backdrop-blur-sm w-[62px] h-[30px] rounded-[20px] py-[7px] pl-2.5 pr-3 flex flex-row items-center gap-1"
      onClick={action}
    >
      <img className="w-4 h-4" src={CoinSvg} />
      <Label className="text-white/90 text-[13px] font-semibold leading-4">
        {t("videoPlayer_text_tip")}
      </Label>
    </div>
  );
};
