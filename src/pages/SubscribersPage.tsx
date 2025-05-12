import { NoContentDisplay } from "@/components/NoContentDisplay";
import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { SearchInput } from "@/components/ui/search-input";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { SubscribersListItem } from "@/features/Profile/components/SubscribersListItem";
import { useSubscribers } from "@/features/Profile/hooks/useSubscribers";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectNumberOfSubscribers } from "@/store/selectors/subscribersSelectors";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { AppDispatch } from "@/store";
import {
  fetchNumberOfSubscribers,
  removeSubscriber,
} from "@/store/reducers/subscribersReducer";

const SubscribersPage = () => {
  const { t } = useTranslation();
  const {
    searchValue,
    fetchSubscribers,
    loadMoreSubscribers,
    handleInputChange,
    learners,
    loading,
    hasMore,
    error,
  } = useSubscribers();

  const numberOfSubscribers = useSelector(selectNumberOfSubscribers);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchNumberOfSubscribers(user.uid));
    }
  }, [dispatch, user?.uid]);

  const onBlock = (subscribersDocId: string) => {
    dispatch(removeSubscriber(subscribersDocId));
  };

  const searchInputPlaceholder =
    numberOfSubscribers > 1
      ? t("subscribers_search_placeholder_plural", {
        noOfSubscribers: numberOfSubscribers.toLocaleString(),
      })
      : t("subscribers_search_placeholder_singular", {
        noOfSubscribers: numberOfSubscribers.toLocaleString(),
      });

  return (
    <ScrollViewContainer className="max-w-3xl mx-auto flex flex-col">
      {numberOfSubscribers === 0 && !loading && (
        <NoContentDisplay
          text={t("empty_subscribers")}
          iconSrc="/icon/users.svg"
        />
      )}
      {numberOfSubscribers > 0 && (
        <SearchInput
          value={searchValue}
          handleValueChange={handleInputChange}
          isLoading={loading}
          placeholder={searchInputPlaceholder}
          containerClassName="mx-5 my-2"
        />
      )}
      <div className="overflow-y-auto">
        <InfiniteScrollList
          hasMore={hasMore}
          loading={loading}
          fetchData={searchValue ? loadMoreSubscribers : fetchSubscribers}
          error={error}
        >
          {learners.map(
            (subscription) =>
              subscription && (
                <SubscribersListItem
                  key={subscription.id}
                  subscription={subscription}
                  onBlockUser={onBlock}
                />
              )
          )}
        </InfiniteScrollList>
      </div>
    </ScrollViewContainer>
  );
};

export default SubscribersPage;
