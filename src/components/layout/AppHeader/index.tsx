import { useCallback, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { HeaderButton } from "./HeaderButton";
import { useStringHelpers } from "@/hooks/useStringHelpers";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useDeviceType } from "@/hooks/useDeviceType";
import { MobileMenu } from "../MobileMenu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RightButton } from "./RightButton";
import { ROUTES } from "@/lib/CONST";

// Educational pattern with brighter colors and more elements
const BrightEducationalPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1000 100"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* Left side books */}
      <g opacity="0.15" transform="translate(50, 50) scale(0.6)">
        {/* Book 1 */}
        <rect x="-30" y="-20" width="60" height="80" rx="2" fill="#1E3A8A" transform="rotate(-10)" />
        <rect x="-30" y="-25" width="60" height="80" rx="2" fill="#3182ce" transform="rotate(-5)" />
        <rect x="-30" y="-30" width="60" height="80" rx="2" fill="#60A5FA" transform="rotate(0)" />
      </g>

      {/* Right side book stack */}
      <g opacity="0.15" transform="translate(900, 50) scale(0.5)">
        <rect x="-30" y="-20" width="60" height="70" rx="2" fill="#1E3A8A" transform="rotate(5)" />
        <rect x="-30" y="-25" width="60" height="70" rx="2" fill="#3182ce" transform="rotate(0)" />
      </g>

      {/* Add more book stacks */}
      <g opacity="0.15" transform="translate(120, 70) scale(0.3)">
        <rect x="-30" y="-20" width="60" height="70" rx="2" fill="#F59E0B" transform="rotate(-7)" />
        <rect x="-30" y="-25" width="60" height="70" rx="2" fill="#FBBF24" transform="rotate(-3)" />
      </g>

      <g opacity="0.15" transform="translate(780, 75) scale(0.25)">
        <rect x="-30" y="-20" width="60" height="70" rx="2" fill="#1E3A8A" transform="rotate(5)" />
        <rect x="-30" y="-25" width="60" height="70" rx="2" fill="#60A5FA" transform="rotate(2)" />
      </g>

      {/* Additional book in top right */}
      <g opacity="0.15" transform="translate(850, 30) scale(0.25)">
        <rect x="-30" y="-20" width="60" height="70" rx="2" fill="#F59E0B" transform="rotate(-3)" />
      </g>

      {/* Far Left - small geometric shapes */}
      <g opacity="0.15" transform="translate(150, 25)">
        <polygon points="0,0 15,20 -15,20" fill="#F59E0B" />
      </g>

      <g opacity="0.15" transform="translate(200, 45)">
        <polygon points="0,0 12,12 0,24 -12,12" fill="#10B981" />
      </g>

      {/* Middle - small geometric shapes */}
      <g opacity="0.15" transform="translate(370, 30)">
        <circle cx="0" cy="0" r="10" fill="#F59E0B" />
      </g>

      <g opacity="0.15" transform="translate(420, 70)">
        <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#3182ce" />
      </g>

      {/* Math symbols - with higher opacity */}
      <g opacity="0.2" transform="translate(800, 35)">
        <text fontFamily="Arial" fontSize="24" fill="#10B981">π</text>
      </g>

      <g opacity="0.2" transform="translate(750, 60)">
        <text fontFamily="Arial" fontSize="22" fill="#3182ce">∑</text>
      </g>

      <g opacity="0.2" transform="translate(680, 40)">
        <text fontFamily="Arial" fontSize="22" fill="#F59E0B">∞</text>
      </g>

      {/* Additional math symbols */}
      <g opacity="0.2" transform="translate(250, 60)">
        <text fontFamily="Arial" fontSize="20" fill="#1E3A8A">+</text>
      </g>

      <g opacity="0.2" transform="translate(310, 35)">
        <text fontFamily="Arial" fontSize="20" fill="#F59E0B">=</text>
      </g>

      <g opacity="0.2" transform="translate(520, 55)">
        <text fontFamily="Arial" fontSize="20" fill="#10B981">÷</text>
      </g>

      <g opacity="0.2" transform="translate(570, 25)">
        <text fontFamily="Arial" fontSize="20" fill="#3182ce">×</text>
      </g>

      <g opacity="0.2" transform="translate(620, 65)">
        <text fontFamily="Arial" fontSize="22" fill="#1E3A8A">√</text>
      </g>

      <g opacity="0.2" transform="translate(460, 30)">
        <text fontFamily="Arial" fontSize="18" fill="#F59E0B">Δ</text>
      </g>

      {/* A few dots spread around */}
      <circle cx="180" cy="40" r="4" fill="#10B981" opacity="0.15" />
      <circle cx="500" cy="85" r="5" fill="#F59E0B" opacity="0.15" />
      <circle cx="720" cy="25" r="4" fill="#1E3A8A" opacity="0.15" />
      <circle cx="280" cy="80" r="3" fill="#3182ce" opacity="0.15" />
      <circle cx="630" cy="40" r="3" fill="#10B981" opacity="0.15" />
      <circle cx="330" cy="70" r="4" fill="#F59E0B" opacity="0.15" />
      <circle cx="540" cy="35" r="3" fill="#1E3A8A" opacity="0.15" />

      {/* Add a small graduation cap icon */}
      <g opacity="0.15" transform="translate(430, 30)">
        <rect x="-12" y="0" width="24" height="4" fill="#1E3A8A" />
        <polygon points="0,-10 16,0 -16,0" fill="#1E3A8A" />
        <circle cx="0" cy="-5" r="2" fill="#F59E0B" />
      </g>

      {/* Another graduation cap */}
      <g opacity="0.15" transform="translate(700, 80) scale(0.7)">
        <rect x="-12" y="0" width="24" height="4" fill="#3182ce" />
        <polygon points="0,-10 16,0 -16,0" fill="#3182ce" />
        <circle cx="0" cy="-5" r="2" fill="#F59E0B" />
      </g>

      {/* Formula fragment */}
      <g opacity="0.15" transform="translate(100, 50)">
        <text fontFamily="Arial" fontSize="14" fill="#1E3A8A">E=mc²</text>
      </g>

      <g opacity="0.15" transform="translate(600, 45)">
        <text fontFamily="Arial" fontSize="14" fill="#10B981">f(x)</text>
      </g>
    </svg>
  </div>
);

export function AppHeader({ className }: { className?: string }) {
  const location = useLocation();
  const params = useParams();
  const { titleCase } = useStringHelpers();
  const { user, isLoggedIn } = useAuth();
  const { isMobile } = useDeviceType();

  const title = useMemo(() => {
    if (location.pathname === ROUTES.MY_PROFILE) return user?.username;

    const allParams = Object.values(params).join("/");
    const pathnameWithoutParams = location.pathname.replace(allParams, "");
    const pageName =
      pathnameWithoutParams.split("/").filter(Boolean).pop() || "";
    const pageNameWithSpaces = pageName.replaceAll("-", " ");

    if (params.username) return params.username;

    return titleCase(pageNameWithSpaces);
  }, [location.pathname, titleCase, params, user?.username]);

  const showBackBtn = useMemo(() => {
    // Get path segments excluding empty strings
    const pathSegments = location.pathname.split("/").filter(Boolean);

    if (isMobile) {
      // Original mobile logic - show back button when there are multiple segments
      return pathSegments.length > 1;
    } else {
      // Desktop/tablet logic
      const isManageSubscriptionRoute =
        pathSegments[0] === "settings" &&
        pathSegments[1] === "manage-subscription" &&
        pathSegments.length > 2;

      const isMyProfileNestedRoute =
        pathSegments[0] === "my-profile" && pathSegments.length === 2;

      return isManageSubscriptionRoute || isMyProfileNestedRoute;
    }
  }, [location.pathname, isMobile]);

  const getParentPath = useCallback(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    // Remove the last segment to get parent path
    pathSegments.pop();
    return pathSegments.length ? `/${pathSegments.join("/")}` : "/";
  }, [location.pathname]);

  const isCreatorProfilePageWithLoggedOutState = useMemo(() => {
    return !isLoggedIn && params.username;
  }, [isLoggedIn, params]);

  // Determine if we're on a profile page
  const isProfilePage = useMemo(() => {
    return location.pathname === ROUTES.MY_PROFILE || params.username;
  }, [location.pathname, params.username]);

  return (
    <div
      className={cn(
        "relative min-h-[52px] md:min-h-[60px] px-4 pt-3.5 pb-2.5 md:px-7 md:py-0.5 md:shadow-sm grid grid-cols-3 bg-light-T100",
        className
      )}
    >
      {/* Bright educational pattern background */}
      <BrightEducationalPattern />

      <div className="flex justify-start items-center z-10">
        {isMobile && isCreatorProfilePageWithLoggedOutState && (
          <img src="/img/logged-out-logo-icon.svg" className="w-7 h-7" />
        )}
        {!isCreatorProfilePageWithLoggedOutState &&
          (showBackBtn ? (
            <HeaderButton to={getParentPath()}>
              <img src="/icon/chevron-left.svg" alt="back" />
            </HeaderButton>
          ) : (
            isMobile && <MobileMenu />
          ))}
      </div>

      <div className="flex justify-center items-center z-10">
        {/* Clear space around username with semi-transparent background */}
        <div className="relative">
          {isProfilePage && (
            <div className="absolute -inset-3 bg-light-T100 opacity-80 rounded-full"></div>
          )}
          <motion.h1
            key={location.pathname}
            className="relative font-bold text-darkBlue text-lg md:text-xl leading-6 md:leading-[26px] -tracking-[0.18px] md:-tracking-[0.2px] text-center whitespace-nowrap"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{
              ease: "linear",
              duration: 0.5,
            }}
          >
            {title}
          </motion.h1>
        </div>
      </div>

      <div className="flex justify-end items-center z-10">
        <RightButton />
      </div>
    </div>
  );
}