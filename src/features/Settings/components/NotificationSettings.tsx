import { SettingsLink } from "./SettingsLink";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Switch } from "./switch";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/Auth/hooks/useAuth.tsx";
import {
  isUserNotificationSettings,
  NotificationSettings as NotificationSettingsType,
  Roles,
  UserNotificationSettingsFields,
  CreatorNotificationSettingsFields,
  UserNotificationSettings,
  CreatorNotificationSettings,
} from "@/features/Auth/types";
import { Spinner } from "@/components/ui/spinner";

interface NotificationToggleProps {
  field: UserNotificationSettingsFields | CreatorNotificationSettingsFields;
  value: boolean;
  onToggle: (setting: string) => Promise<void>;
}

function NotificationToggle({
  field,
  value,
  onToggle,
}: NotificationToggleProps) {
  const { t } = useTranslation(undefined, {
    keyPrefix: "notification_setting",
  });

  return (
    <SettingsLink text={t(field)} onClick={() => onToggle(field)}>
      <Switch value={value} onChange={() => onToggle(field)} />
    </SettingsLink>
  );
}

export function NotificationSettings({ className }: { className?: string }) {
  const { getNotificationSettings, user, setSettings } = useAuth();
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettingsType | null>(null);

  useEffect(() => {
    if (user) {
      (async () => {
        const settings = await getNotificationSettings();
        setNotificationSettings(settings);
      })();
    }
  }, [user, getNotificationSettings]);

  const toggleUserSetting = async (setting: UserNotificationSettingsFields) => {
    if (
      !notificationSettings ||
      !isUserNotificationSettings(notificationSettings)
    )
      return;

    const newSettings: UserNotificationSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    };

    setNotificationSettings(newSettings);
    if (user) {
      await setSettings(user, user.role, newSettings);
    }
  };

  const toggleCreatorSetting = async (
    setting: CreatorNotificationSettingsFields
  ) => {
    if (
      !notificationSettings ||
      isUserNotificationSettings(notificationSettings)
    )
      return;

    const newSettings: CreatorNotificationSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    };

    setNotificationSettings(newSettings);
    if (user) {
      await setSettings(user, user.role, newSettings);
    }
  };

  return !notificationSettings || !user ? (
    <Spinner />
  ) : (
    <div
      className={cn(
        "flex flex-col min-w-[50%] rounded-[18px] bg-grayscale-4",
        className
      )}
    >
      {isUserNotificationSettings(notificationSettings) &&
        user.role === Roles.USER && (
          <>
            {Object.keys(UserNotificationSettingsFields).map((field) => {
              const settingField = field as UserNotificationSettingsFields;
              return (
                <NotificationToggle
                  key={settingField}
                  field={settingField}
                  onToggle={() => toggleUserSetting(settingField)}
                  value={notificationSettings[settingField]}
                />
              );
            })}
          </>
        )}
      {!isUserNotificationSettings(notificationSettings) &&
        user.role === Roles.CREATOR && (
          <>
            {Object.keys(CreatorNotificationSettingsFields).map((field) => {
              const settingField = field as CreatorNotificationSettingsFields;
              return (
                <NotificationToggle
                  key={settingField}
                  field={settingField}
                  onToggle={() => toggleCreatorSetting(settingField)}
                  value={notificationSettings[settingField]}
                />
              );
            })}
          </>
        )}
    </div>
  );
}
