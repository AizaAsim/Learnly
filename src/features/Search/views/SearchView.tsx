import { NoContentDisplay } from "@/components/NoContentDisplay";
import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { SearchInput } from "@/components/ui/search-input";
import { useTranslation } from "react-i18next";
import { SearchListItem } from "../components/SearchListItem";
import { useSearch } from "../hooks/useSearch";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";

export const SearchView = () => {
  const { t } = useTranslation();
  const {
    term,
    isLoading,
    creators,
    hasMore,
    handleInputChange,
    isEmpty,
    loadMoreCreators,
  } = useSearch();

  return (
    <ScrollViewContainer className="max-w-[678px] mx-auto flex flex-col">
      <div>
        <SearchInput
          value={term}
          handleValueChange={handleInputChange}
          className="z-10"
          containerClassName="mx-4 mt-2 mb-3 md:my-5"
          isLoading={isLoading}
        />
      </div>
      {!term && creators.length === 0 && (
        <NoContentDisplay
          text={t("search_text_placeholder_text")}
          iconSrc="/icon/star-bold.svg"
          textClassName="w-[139px]"
        />
      )}
      {term && isEmpty && (
        <NoContentDisplay
          iconSrc="/icon/no-search.svg"
          text={t("search_text_notFound")}
        />
      )}
      <div className="overflow-y-auto">
        <InfiniteScrollList
          loading={isLoading}
          fetchData={loadMoreCreators}
          hasMore={hasMore}
        >
          {creators.map((creator) => (
            <SearchListItem key={creator.id} creator={creator} />
          ))}
        </InfiniteScrollList>
      </div>
    </ScrollViewContainer>
  );
};
