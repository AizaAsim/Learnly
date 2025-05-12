import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

export const useSettings = () => {
  const context = useContext(SettingsContext);

  return {
    isSideMenu: context?.isSideMenu || false,
  };
};
