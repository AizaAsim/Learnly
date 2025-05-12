import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Roles } from "@/features/Auth/types";
import { useDocumentOnce } from "@/hooks/useDocumentOnce";
import { useMemo } from "react";
import { BlockedUser } from "../types";

export const useUserBlocked = (otherUserId: string) => {
  const { user } = useAuth();
  const isCreator = user?.role === Roles.CREATOR;
  const creatorId = isCreator ? user.uid : otherUserId;
  const userId = isCreator ? otherUserId : user?.uid;

  const {
    document: blockedUser,
    loading,
    error,
  } = useDocumentOnce<BlockedUser>("blocked_users", `${creatorId}_${userId}`);

  const isBlocked = useMemo(() => blockedUser?.blocked, [blockedUser]);

  return {
    isBlocked,
    loading,
    error,
  };
};
