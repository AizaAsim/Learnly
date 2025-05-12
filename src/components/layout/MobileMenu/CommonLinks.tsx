import { useModal } from "@/hooks/useModal";
import { MobileMenuLink } from "./MobileMenuLink";
import { useTranslation } from "react-i18next";
import { LogoutView } from "@/features/Auth/components/views/LogoutView";
import { Button } from "@/components/ui/button";
import SvgIcon from "@/components/ui/svg-icon";
import { cn } from "@/lib/utils";
import { useLoaderData } from "react-router-dom";

interface CommonLinksProps {
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const CommonLinks = ({ setIsMenuOpen }: CommonLinksProps) => {
  const { setModal, openModal } = useModal();
  const { t } = useTranslation();

  const loaderData = useLoaderData() as { id: string };
  const isReelPage = loaderData?.id; // all pages with a reel have an id

  const handleSignOut = () => {
    setIsMenuOpen(false);
    setModal(<LogoutView />, {
      title: t("nav_link_signout"),
      subtitle: t("logoutView_text_subtitle"),
    });
    openModal();
  };
  return (
    <>
      <MobileMenuLink
        icon="/icon/help-center.svg"
        text={t("nav_link_helpCenter")}
        to="/terms"
        endIcon="/icon/redirect-arrow.svg"
        className={cn({
          "filter brightness-0 invert": isReelPage,
        })}
      />
      <Button
        variant={"link"}
        size={"sm"}
        onClick={handleSignOut}
        className={cn(
          "h-[38px] gap-1.5 font-semibold -tracking-[0.14px] leading-4.5 hover:bg-grayscale-4 w-full justify-start !rounded-sm p-2",
          {
            "filter brightness-0 invert": isReelPage,
          }
        )}
      >
        <SvgIcon src="/icon/sign-out.svg" width="22px" height="22px" />
        <p>{t("nav_link_signout")}</p>
      </Button>
    </>
  );
};
