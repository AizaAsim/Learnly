import { Label } from "@radix-ui/react-dropdown-menu";
import { ReactNode, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentReel } from "../../hooks/useCurrentReel";
import { useVideoUploadModals } from "../../hooks/useVideoUploadModals";
import { useModal } from "@/hooks/useModal";
import { useTranslation } from "react-i18next";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useDeviceType } from "@/hooks/useDeviceType";
import { usePostNotificationModals } from "../../hooks/usePostNotificationModals";

export function ReelHeader({
  menu,
  className,
  title,
}: {
  menu: ReactNode;
  className?: string;
  title?: string;
}) {
  const { reel } = useCurrentReel();
  const { isMobile } = useDeviceType();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isPreview = location.pathname.includes("preview");
  const isHome = location.pathname.includes("home");
  const isRemoved = location.pathname.includes("removed");

  const { openReviewReel } = useVideoUploadModals();
  const { openPostRemovedModal } = usePostNotificationModals();
  const { openModal } = useModal();

  const labelText = useMemo(() => {
    if (isPreview) return t("videoPlayer_text_preview");

    if (isRemoved) return t("videoPlayer_text_removed");

    return title || reel?.creator?.username || "";
  }, [isPreview, isRemoved, reel, t, title]);

  const backButtonFunction = () => {
    if (isPreview) {
      openReviewReel();
      openModal();
    } else if (isRemoved) {
      openPostRemovedModal();
    }
    navigate(-1);
  };

  return (
    <div
      className={cn(
        "text-white/70 fixed h-14 w-full top-0 px-4 lg:px-6 z-50",
        className
      )}
    >
      <div className="flex flex-row justify-between items-center h-full">
        <span
          className={cn(
            "w-11 h-11 rounded-xxl flex items-center justify-start",
            {
              "backdrop-blur-lg bg-white/20 justify-center": !isMobile,
            }
          )}
        >
          {isHome ? (
            <MobileMenu />
          ) : (
            <ChevronLeft
              onClick={backButtonFunction}
              size={28}
              strokeWidth={"3"}
            />
          )}
        </span>

        <Label className="text-lg font-bold">{labelText}</Label>
        {menu}
      </div>
    </div>
  );
}
