import { useEffect, useMemo, useState } from "react";

const mobileWidth = 768;
const desktopWidth = 1024;

export const useDeviceType = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const deviceType = useMemo(() => {
    if (width <= mobileWidth) {
      return "mobile";
    } else if (width <= desktopWidth) {
      return "tablet";
    } else {
      return "desktop";
    }
  }, [width]);

  const isMobile = width <= mobileWidth;
  const isTablet = width <= desktopWidth && width > mobileWidth;
  const isDesktop = width > desktopWidth;

  return { isMobile, isTablet, isDesktop, deviceType };
};
