import { useToast } from "@/components/ui/use-toast";
import { UserActionDropdown } from "@/components/UserActionDropdown";
import { UserListItem } from "@/components/UserListItem";
import { UserRootDoc } from "@/features/Auth/types";
import { useDocumentOnce } from "@/hooks/useDocumentOnce";
import { logError } from "@/services/logging";
import { MouseEvent } from "react";
import { unblockUser } from "../services/callable";
import { useTranslation } from "react-i18next";

interface BlockedUserListItemProps {
  userId: string;
  onUnblockUser: (id: string) => void;
}

export const BlockedUserListItem = ({
  userId,
  onUnblockUser,
}: BlockedUserListItemProps) => {
  const {
    document: subscriber,
    error,
    loading,
  } = useDocumentOnce<UserRootDoc>("users", userId);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleUnBlock = async (event: MouseEvent) => {
    try {
      if (!subscriber) return;
      event.stopPropagation();
      await unblockUser({ userId: subscriber.id });
      toast({ text: "User unblocked successfully" });
      onUnblockUser(subscriber.id);
    } catch (error) {
      logError("Failed to unblock user", error);
      toast({ text: "Failed to unblock user" });
    }
  };

  const actions = [
    {
      label: "Unblock",
      onClick: handleUnBlock,
      iconSrc: "/icon/ban-black.svg",
    },
  ];

  return (
    <UserListItem
      loading={loading}
      error={error?.message}
      leftTopContent={subscriber?.displayName}
      leftBottomContent={t("user_blocked")}
      avatarUrl={subscriber?.avatar_url || null}
      rightContent={
        <UserActionDropdown
          actions={actions}
          menuTriggerClassName="w-9 h-9 bg-grayscale-8"
        />
      }
    />
  );
};
