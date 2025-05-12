import { createContext, ReactNode } from "react";

interface SettingsContextType {
  isSideMenu: boolean;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
  isSideMenu: boolean;
}

export const SettingsProvider = ({
  children,
  isSideMenu,
}: SettingsProviderProps) => {
  return (
    <SettingsContext.Provider value={{ isSideMenu }}>
      {children}
    </SettingsContext.Provider>
  );
};
