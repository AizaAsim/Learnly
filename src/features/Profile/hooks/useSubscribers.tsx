import { AppDispatch } from "@/store";
import { fetchSubscribers } from "@/store/reducers/subscribersReducer";
import { useCallback, useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash-es/debounce";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Subscriber } from "@/features/Stripe/types";
import {
  selectHasMoreSubscribers,
  selectSubscribers,
  selectSubscribersError,
  selectSubscribersStatus,
} from "@/store/selectors/subscribersSelectors";

export const useSubscribers = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  // Get learners, loading, error and hasMore from Redux state for search results
  const reduxSubscribers = useSelector(selectSubscribers);
  const reduxLoading = useSelector(selectSubscribersStatus) === "loading";
  const reduxError = useSelector(selectSubscribersError);
  const reduxHasMore = useSelector(selectHasMoreSubscribers);

  // Get learners, loading, error and hasMore from Firestore for non-search results
  const {
    documents: firestoreSubscriptions,
    fetchDocuments: fetchFirestoreSubscriptions,
    loading: firestoreLoading,
    hasMore: firestoreHasMore,
    error: firestoreError,
  } = useFirestoreCollection<Subscriber>({
    collectionPath: "learners",
    batchSize: 10,
    orderByField: "startDate",
    orderByDirection: "desc",
    whereClauses: [
      ["creatorId", "==", user?.uid],
      ["status", "in", ["active", "trialing"]],
    ],
    useCollectionGroup: false,
    ignoreExclusions: true,
  });

  const debouncedFetchSubscribers = useMemo(
    () =>
      debounce((term: string, isLoadMore: boolean = false) => {
        dispatch(
          fetchSubscribers({
            searchTerm: term,
            resetList: !isLoadMore,
          })
        );
      }, 600),
    [dispatch]
  );

  const fetchSubscribersAction = useCallback(() => {
    if (searchValue) {
      debouncedFetchSubscribers(searchValue);
    } else {
      fetchFirestoreSubscriptions();
    }
  }, [fetchFirestoreSubscriptions, searchValue, debouncedFetchSubscribers]);

  const loadMoreSubscribers = useCallback(() => {
    if (searchValue) {
      // When loading more search results, pass true to prevent resetting the list
      debouncedFetchSubscribers(searchValue, true);
    }
  }, [debouncedFetchSubscribers, searchValue]);

  useEffect(() => {
    return () => {
      debouncedFetchSubscribers.cancel();
    };
  }, [debouncedFetchSubscribers]);

  const handleInputChange = useCallback(
    (term: string) => {
      setSearchValue(term);
      if (term) {
        // Always use the debounced function with resetList true
        debouncedFetchSubscribers(term);
      } else {
        debouncedFetchSubscribers.cancel();
      }
    },
    [debouncedFetchSubscribers]
  );

  // Determine which data to use based on search state
  const learners = searchValue ? reduxSubscribers : firestoreSubscriptions;
  const hasMore = searchValue ? reduxHasMore : firestoreHasMore;
  const loading = searchValue ? reduxLoading : firestoreLoading;
  const error = searchValue ? reduxError : firestoreError;

  // Fixes occasional duplicate learners
  const unique = new Set(learners.map((sub) => sub.id));
  const uniqueSubscribers = Array.from(unique).map((id) =>
    learners.find((sub) => sub.id === id)
  );

  return {
    searchValue,
    handleInputChange,
    fetchSubscribers: fetchSubscribersAction,
    loadMoreSubscribers,
    learners: uniqueSubscribers,
    loading,
    hasMore,
    error,
  };
};
