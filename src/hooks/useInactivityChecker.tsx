import { useState, useEffect, useRef, useCallback } from "react";

const EVENTS_TO_WATCH = [
  "mousemove",
  "click",
  "keydown",
  "mousewheel",
  "mouseover",
  'touchstart',
  'touchend',
  'dragstart',
  'dragend',
];
const INACTIVE_TIME_IN_MILLIS = 2200;

export const useInactivityChecker = () => {
  const [isInactive, setIsInactive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsInactive(false);
    timeoutRef.current = setTimeout(() => {
      setIsInactive(true);
    }, INACTIVE_TIME_IN_MILLIS);
  }, []);

  useEffect(() => {
    EVENTS_TO_WATCH.forEach((e) => window.addEventListener(e, resetTimeout));

    resetTimeout(); // Initialize the fade timeout

    return () => {
      EVENTS_TO_WATCH.forEach((e) =>
        window.removeEventListener(e, resetTimeout)
      );
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimeout]);

  return isInactive;
};
