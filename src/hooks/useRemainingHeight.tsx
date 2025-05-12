import { useState, useEffect, useRef } from "react";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useBanner } from "@/hooks/useBanner";
import { useAuth } from "@/features/Auth/hooks/useAuth";

export const useRemainingHeight = () => {
  const { bannerHeight } = useBanner();
  const { isMobile } = useDeviceType();
  const { isLoggedIn } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [remainingHeight, setRemainingHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerTop = containerRef.current.offsetTop;
        const windowHeight = window.innerHeight;
        const heightOfBottomBar = isMobile && isLoggedIn ? 52 : 0;
        setRemainingHeight(
          windowHeight - containerTop - heightOfBottomBar - bannerHeight
        );
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [bannerHeight, isMobile, isLoggedIn]);

  return { remainingHeight, containerRef };
};
