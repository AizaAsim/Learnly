import { TabbedLinks } from "@/components/layout/TabbedLinks";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useCurrentReel } from "@/features/Videos/hooks/useCurrentReel";
import { useDeviceType } from "@/hooks/useDeviceType";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

export function VideoLayout() {
  const { isMobile } = useDeviceType();
  const { isLoggedIn } = useAuth();
  const { reel } = useCurrentReel();

  const isSubscribed = reel && reel?.playbackIds.length > 0;

  return (
    <div className={cn("relative h-[100dvh]")}>
      <div className="h-full bg-grayscale-80">
        <Outlet />
      </div>
      {/* There is no tabbed links in locked reel page */}
      {isMobile && isLoggedIn && isSubscribed && (
        <TabbedLinks
          className="fixed w-full bottom-0 left-0 right-0"
          variant="blurred"
        />
      )}
    </div>
  );
}

export default VideoLayout;