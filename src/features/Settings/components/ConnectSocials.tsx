import { SocialItem } from "@/components/SocialItem";
import { useSocials } from "@/features/Profile/hooks/useSocials";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export function ConnectSocials({ className }: { className?: string }) {
  const { t } = useTranslation(undefined, {
    keyPrefix: "settings_socials",
  });
  const { socials } = useSocials();
  const [connectedStatus, setConnectedStatus] = useState(
    Array(socials.length).fill(false)
  );

  const toggleConnection = useCallback(
    (index: number) => {
      const newStatus = [...connectedStatus];
      newStatus[index] = !newStatus[index];
      setConnectedStatus(newStatus);
    },
    [connectedStatus]
  );

  return (
    <div className={cn("w-full flex flex-col gap-10 md:gap-8", className)}>
      <p className="text-dark-T60 font-medium text-base leading-[22px] -tracking-[0.16px] text-center mx-auto">
        {t("description")}
      </p>
      <div className="flex flex-col gap-3.5 mb-8 md:mb-6">
        {socials.map(({ name }, index) => (
          <SocialItem
            key={index}
            index={index}
            name={name}
            isConnected={connectedStatus[index]}
            toggleConnection={toggleConnection}
          />
        ))}
      </div>
    </div>
  );
}
