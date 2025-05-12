import { useModal } from "@/hooks/useModal";
import { useTranslation } from "react-i18next";
import { LogoutView } from "@/features/Auth/components/views/LogoutView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommonLinksProps {
  isExtendedOnLargeScreen?: boolean;
}

export const CommonLinks = ({ isExtendedOnLargeScreen }: CommonLinksProps) => {
  const { setModal, openModal } = useModal();
  const { t } = useTranslation();

  const handleSignOut = () => {
    setModal(<LogoutView />, {
      title: t("nav_link_signout"),
      subtitle: t("logoutView_text_subtitle"),
    });
    openModal();
  };
  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "justify-center text-base p-3 w-full leading-6 -tracking-[0.16px] hover:bg-transparent",
          {
            "lg:justify-start": isExtendedOnLargeScreen,
          }
        )}
        icon={
          <img
            src="/icon/sign-out.svg"
            className={cn("w-6 h-6 -mr-1.5", {
              "lg:mr-2": isExtendedOnLargeScreen,
            })}
          />
        }
        onClick={handleSignOut}
      >
        <span
          className={cn("hidden", { "lg:inline": isExtendedOnLargeScreen })}
        >
          {t("nav_link_signout")}
        </span>
      </Button>
    </>
  );
};
