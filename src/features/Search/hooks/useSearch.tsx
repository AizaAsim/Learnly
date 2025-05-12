import { AppDispatch } from "@/store";
import {
  fetchCreatorsBySearch,
  resetOffset,
  setTerm,
} from "@/store/reducers/searchCreatorReducer";
import { selectSearchCreator } from "@/store/selectors/searchCreatorSelector";
import debounce from "lodash-es/debounce";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, creators, hasMore, term, isEmpty } =
    useSelector(selectSearchCreator);

  const getCreatorsBySearch = useCallback(
    (searchTerm: string, resetList: boolean) => {
      if (resetList) {
        dispatch(resetOffset());
      }
      dispatch(fetchCreatorsBySearch({ searchTerm, resetList }));
    },
    [dispatch]
  );

  const debouncedSearchCreators = useMemo(
    () =>
      debounce(
        (searchTerm: string) => getCreatorsBySearch(searchTerm, true),
        600
      ),
    [getCreatorsBySearch]
  );

  const handleInputChange = useCallback(
    (newTerm: string) => {
      dispatch(setTerm(newTerm));
      debouncedSearchCreators(newTerm);
    },
    [dispatch, debouncedSearchCreators]
  );

  const loadMoreCreators = useCallback(() => {
    if (hasMore && !isLoading) {
      dispatch(fetchCreatorsBySearch({ searchTerm: term, resetList: false }));
    }
  }, [dispatch, hasMore, isLoading, term]);

  return {
    term,
    isLoading,
    creators,
    hasMore,
    handleInputChange,
    isEmpty,
    loadMoreCreators,
  };
};
