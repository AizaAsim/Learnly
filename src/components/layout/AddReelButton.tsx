import { Button } from "@/components/ui/button";
import SvgIcon from "@/components/ui/svg-icon";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useVideoUploadModals } from "@/features/Videos/hooks/useVideoUploadModals";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { Trans } from "react-i18next";

const icon = "/icon/add.svg";

export const AddReelButton = ({
  iconOnly = false,
  className,
  iconWidth,
  iconHeight,
  iconClass,
  setIsMenuOpen,
}: {
  iconOnly?: boolean;
  className?: string;
  iconWidth?: string;
  iconHeight?: string;
  iconClass?: string;
  setIsMenuOpen?: (isOpen: boolean) => void;
}) => {
  const { user } = useAuth();
  const { isOpen, openModal } = useModal();
  const { openFilePicker } = useVideoUploadModals();

  const addReel = () => {
    if (isOpen || user?.isBlocked === true) return;
    if (setIsMenuOpen) setIsMenuOpen(false);
    openFilePicker();
    openModal();
  };

  return (
    <Button
      variant={"link"}
      size={iconOnly ? "icon" : "sm"}
      onClick={addReel}
      className={cn(
        "h-[40px] items-start gap-1.5 font-semibold -tracking-[0.16px] leading-6 p-2 md:items-center md:mx-auto md:p-3 md:w-full",
        className
      )}
    >
      <SvgIcon
        src={icon}
        width={iconWidth}
        height={iconHeight}
        className={cn(iconClass)}
      />
      {!iconOnly && (
        <p>
          <Trans i18nKey="nav_link_add_reel" />
        </p>
      )}
    </Button>
  );
};
