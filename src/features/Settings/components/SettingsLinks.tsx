import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { SettingsLink } from "./SettingsLink";
import { useTranslation } from "react-i18next";

// common top
import UserEditIcon from "@/assets/user-edit.svg";
import NotificationIcon from "@/assets/notification.svg";

// common bottom
import AccountRecoveryIcon from "@/assets/account-recovery.svg";
import SignOutIcon from "@/assets/signout.svg";
import DeleteIcon from "@/assets/delete.svg";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Roles } from "@/features/Auth/types";
import { useDeleteAccountModal } from "../hooks/useDeleteAccountModal";

export function SettingsLinks({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { signOut, currentRole } = useAuth();
  const { openDeleteAccountModal } = useDeleteAccountModal();
  const navigate = useNavigate();

  const showSignOutModal = () => {
    // TODO: Pop modal with correct component
    signOut();
  };

  return (
    <div className={cn("flex flex-col min-w-[50%]", className)}>
      {/* Common Top Links */}
      <SettingsLink
        icon={UserEditIcon}
        text={t("settings_text_editProfile")}
        onClick={() => navigate("/settings/edit-profile")}
      />

      {currentRole === Roles.CREATOR && children}

      {currentRole === Roles.USER && children}

      <SettingsLink
        icon={NotificationIcon}
        text={t("settings_text_notifications")}
        onClick={() => navigate("/settings/notifications")}
        pathname="/settings/notifications"
      />

      <SettingsLink
        icon={AccountRecoveryIcon}
        text={t("settings_text_accountRecovery")}
        onClick={() => navigate("/settings/add-recovery-method")}
        pathname="/settings/add-recovery-method"
      />

      <SettingsLink
        icon={SignOutIcon}
        text={t("settings_text_signOut")}
        onClick={showSignOutModal}
      />
      <SettingsLink
        icon={DeleteIcon}
        text={t("settings_text_deleteAccount")}
        onClick={openDeleteAccountModal}
        className="border-none text-red-500"
      />
    </div>
  );
}
