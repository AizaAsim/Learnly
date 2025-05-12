import { AppHeader } from "@/components/layout/AppHeader";
import { SideMenu } from "@/components/layout/SideMenu";
import { TabbedLinks } from "@/components/layout/TabbedLinks";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Roles } from "@/features/Auth/types";
import { useBanner } from "@/hooks/useBanner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CommonLinks } from "@/components/layout/SideMenu/CommonLinks";

export function MainLayout() {
  const location = useLocation();
  const { isLoggedIn, currentRole } = useAuth();
  const { isMobile } = useDeviceType();
  const { hasBanner, banner, bannerHeight } = useBanner();

  const isInternalPage = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    return pathSegments.length > 1;
  }, [location.pathname]);

  const sideMenuFooter = useMemo(
    () =>
      [Roles.USER, Roles.CREATOR].includes(currentRole) ? (
        <CommonLinks />
      ) : null,
    [currentRole]
  );

  return (
    <div className="bg-white">
      {hasBanner && banner}
      <div
        style={{
          minHeight: hasBanner ? `calc(100vh - ${bannerHeight}px)` : "100vh",
        }}
        className={cn("w-full flex", {
          "pb-[52px]": isMobile && isLoggedIn,
        })}
      >
        {!isMobile && (
          <SideMenu
            footer={sideMenuFooter}
            hasBanner={hasBanner}
            bannerHeight={bannerHeight}
          />
        )}
        <div
          className={cn(
            "w-full min-h-full flex flex-col md:ml-[76px] relative",
            {
              "lg:ml-[353px]": location.pathname.includes("settings"),
            }
          )}
        >
          <AppHeader className="sticky top-0 z-50" />
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
      {isMobile && isLoggedIn && !isInternalPage && (
        <TabbedLinks className="fixed w-full bottom-0 left-0 right-0 border-r-0 border-l-0 border-b-0 border-t border-dark-T8" />
      )}
    </div>
  );
}

export default MainLayout;