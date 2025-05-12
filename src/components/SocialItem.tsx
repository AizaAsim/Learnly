import { useSocials } from "@/features/Profile/hooks/useSocials";
import { Trans } from "react-i18next";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SocialItemProps {
  index: number;
  name: string;
  isConnected: boolean;
  toggleConnection: (index: number) => void;
}

export const SocialItem = ({
  index,
  name,
  isConnected,
  toggleConnection,
}: SocialItemProps) => {
  const { getSocialIconPath } = useSocials();

  return (
    <div className="flex justify-between">
      <div className="flex items-center justify-center gap-x-1.5">
        <div className="w-5 h-5 flex justify-center items-center md:w-[22px] md:h-[22px]">
          <img
            src={getSocialIconPath(name)}
            alt={name}
            className="w-5 h-5 md:w-[22px] md:h-[22px]"
          />
        </div>
        <span className="font-medium text-sm leading-4.5 -tracking-[0.16px] md:text-[15px] md:leading-5 md:-tracking-[0.225px]">
          <Trans size={8} i18nKey={name} />
        </span>
      </div>
      <div className="flex">
        <Button
          variant="outline"
          className={cn(
            "relative w-[108px] md:w-[114px] h-auto md:h-[40px] bg-white rounded-xl border border-dark-T16 !px-4 py-[9px] md:py-[10px] duration-200",
            "font-semibold text-primaryBlue text-sm leading-4.5 -tracking-[0.14px] md:text-[15px] md:leading-5 md:-tracking-[0.225px] ",
            isConnected ? "bg-dark-T8 border-0" : ""
          )}
          onClick={() => toggleConnection(index)}
        >
          <Trans i18nKey={isConnected ? "Disconnect" : "Connect"} />
        </Button>
      </div>
    </div>
  );
};
