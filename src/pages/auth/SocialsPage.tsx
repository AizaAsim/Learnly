import { Trans, useTranslation } from "react-i18next";
import { AuthTitle } from "@/components/layout/AuthTitle";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocials } from "@/features/Profile/hooks/useSocials";
import { Button } from "@/components/ui/button";
import { SocialItem } from "@/components/SocialItem";

function SocialsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { socials } = useSocials();
  const [connectedStatus, setConnectedStatus] = useState(
    Array(socials.length).fill(false)
  );
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const connectedSocials = socials
      .filter((_, index) => connectedStatus[index])
      .map(({ name }) => ({
        name,
      }));
    if (connectedSocials.length > 0) setIsDisabled(false);
  }, [socials, connectedStatus]);

  const toggleConnection = useCallback(
    (index: number) => {
      const newStatus = [...connectedStatus];
      newStatus[index] = !newStatus[index];
      setConnectedStatus(newStatus);
    },
    [connectedStatus]
  );

  const onContinue = useCallback(() => {
    navigate("/my-profile");
  }, [navigate]);

  const onSkip = useCallback(() => {
    navigate("/my-profile");
  }, [navigate]);

  return (
    <div className="bg-white">
      <div className="flex flex-col">
        <AuthTitle
          title={t("social_account_title")}
          description={t("social_account_description")}
        />

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

        <div className="flex flex-col items-center gap-y-4">
          <Button disabled={isDisabled} onClick={onContinue}>
            <Trans i18nKey="social_account_button_continue" />
          </Button>
          <Button
            variant="link"
            onClick={onSkip}
            className="text-dark-T50 font-semibold text-[15px]/5 -tracking-[0.15px] cursor-pointer !p-0 h-auto"
          >
            <Trans i18nKey="social_account_button_skip" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SocialsPage;
