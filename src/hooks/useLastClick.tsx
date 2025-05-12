import { useCallback, useEffect, useState } from "react";

export const useLastClick = () => {
  const [lastClick, setLastClick] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);

  const clearLastClick = useCallback(() => {
    setLastClick(0);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      setLastClick(Date.now());
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - lastClick);
    }, 250); // This is the refresh rate of the elapsed time

    return () => {
      clearInterval(interval);
    };
  }, [lastClick]);

  return { lastClick, clearLastClick, elapsed };
};
