import { useAuth } from "@/features/Auth/hooks/useAuth";
import { CreatorSettings } from "@/features/Settings/components/CreatorSettings";
import { SettingsLinks } from "@/features/Settings/components/SettingsLinks";
import { UserSettings } from "@/features/Settings/components/UserSettings";
import { cn } from "@/lib/utils";
import { Roles } from "../../Auth/types";
import { SettingsProvider } from "../context/SettingsContext";

interface SettingsProps {
  className?: string;
  isSideMenu?: boolean;
}

export const Settings = ({ className, isSideMenu = false }: SettingsProps) => {
  const { currentRole } = useAuth();
  return (
    <SettingsProvider isSideMenu={isSideMenu}>
      <SettingsLinks className={cn(className)}>
        {currentRole === Roles.USER ? <UserSettings /> : <CreatorSettings />}
      </SettingsLinks>
    </SettingsProvider>
  );
};
