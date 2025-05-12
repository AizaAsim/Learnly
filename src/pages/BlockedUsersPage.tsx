import { NoContentDisplay } from "@/components/NoContentDisplay";
import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { BlockedUserListItem } from "@/features/Profile/components/BlockedUserListItem";
import { BlockedUser } from "@/features/Profile/types";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useTranslation } from "react-i18next";

const BlockedUsersPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    documents: blockedUsers,
    fetchDocuments: fetchBlockedUsers,
    excludeDocument,
    loading,
    hasMore,
    error,
  } = useFirestoreCollection<BlockedUser>({
    collectionPath: "blocked_users",
    batchSize: 20,
    orderByField: "timestamp",
    orderByDirection: "desc",
    whereClauses: [
      ["creatorId", "==", user?.uid],
      ["blocked", "==", true],
    ],
    ignoreExclusions: true,
  });

  const onUnblockUser = (userId: string) => {
    excludeDocument("xuserId", userId);
  };

  return (
    <ScrollViewContainer className="overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {blockedUsers.length === 0 && !loading && (
          <NoContentDisplay
            text={t("empty_blocked_users")}
            iconSrc="/icon/ban-light.svg"
          />
        )}
        <InfiniteScrollList
          loading={loading}
          hasMore={hasMore}
          fetchData={fetchBlockedUsers}
          error={error}
          className="py-2"
        >
          <div className="mt-2">
            {blockedUsers.map((user) => (
              <BlockedUserListItem
                key={user.id}
                userId={user.userId}
                onUnblockUser={onUnblockUser}
              />
            ))}
          </div>
        </InfiniteScrollList>
      </div>
    </ScrollViewContainer>
  );
};

export default BlockedUsersPage;
