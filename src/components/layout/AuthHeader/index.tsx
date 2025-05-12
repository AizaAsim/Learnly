import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { HeaderButton } from "./HeaderButton";
import { useDeviceType } from "@/hooks/useDeviceType";
import ChevronLeftIcon from "/icon/chevron-left.svg";
import WebLogo from "/img/web-logo.svg";
import { ROUTES } from "@/lib/CONST";
import { cn } from "@/lib/utils";

export function AuthHeader() {
  const location = useLocation();
  const { isMobile } = useDeviceType();

  const showBackBtn = useMemo(() => {
    const rootPaths = [
      ROUTES.AUTH,
      ROUTES.DISPLAY_NAME_AUTH,
      ROUTES.BLOCK,
      ROUTES.NAME_AUTH,
    ];
    return !rootPaths.includes(location.pathname);
  }, [location.pathname]);

  return (
    <header className="flex min-h-[52px] md:min-h-[76px] justify-center pt-3.5 px-4 pb-2.5 sticky top-0 bg-light-T90 backdrop-blur z-50">
      <div className="absolute top-3.5 left-4">
        {showBackBtn && (
          <HeaderButton to={-1}>
            <img src={ChevronLeftIcon} alt="back" />
          </HeaderButton>
        )}
      </div>
      {!isMobile && <div className="absolute top-3.5 mx-auto md:top-1/2 md:transform md:-translate-y-1/2">
        <img
          src={WebLogo}
          className={cn({ "relative left-1.5 -top-0.5": isMobile })}
          alt="logo"
          width={isMobile ? 139 : 100}
          height={isMobile ? 32 : 24}
        />
      </div>}
    </header>
  );
}
