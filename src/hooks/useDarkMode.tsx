import { useEffect, useState } from "react";

export function useDarkMode() {
  useEffect(() => {
    // Check if the user has set a preference for dark mode.
    // If not, check the user's system settings.
    const storageSet = localStorage.getItem("dark") !== null;
    if (!storageSet) {
      const darkPref = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      localStorage.setItem("dark", darkPref ? "true" : "false");
    }

    // Set the initial mode.
    if (localStorage.getItem("dark") === "true") {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }, []);

  // Load the dark mode preference from local storage or the user's system settings.
  const [isDarkMode, setIsDarkMode] = useState(
    Boolean(localStorage.getItem("dark"))
  );

  const enableDarkMode = () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("dark", "true");
    setIsDarkMode(true);
  };

  const disableDarkMode = () => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("dark", "false");
    setIsDarkMode(false);
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  };

  return { isDarkMode, toggleDarkMode };
}
