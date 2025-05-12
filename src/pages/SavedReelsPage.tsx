import { NoContentDisplay } from "@/components/NoContentDisplay";
import { InfiniteScrollList } from "@/components/ui/infinite-scroll-list";
import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { useSubscribeModal } from "@/features/Stripe/hooks/useSubscribeModal";
import { ReelDisplayContainer } from "@/features/Videos/components/ReelDisplayContainer";
import { VideoThumbnail } from "@/features/Videos/components/VideoThumbnail";
import { AppDispatch } from "@/store";
import { fetchSavedReels } from "@/store/reducers/savedReelsReducer";
import {
  selectSavedReels,
  selectSavedReelsError,
  selectSavedReelsHasMore,
  selectSavedReelsStatus,
} from "@/store/selectors/savedReelsSelectors";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SavedReelsPage = () => {
  const reels = useSelector(selectSavedReels);
  const error = useSelector(selectSavedReelsError);
  const status = useSelector(selectSavedReelsStatus);
  const isLoading = status === "loading";
  const hasMore = useSelector(selectSavedReelsHasMore);
  const dispatch = useDispatch<AppDispatch>();
  const { openSubscribeCheckout } = useSubscribeModal();
  const { t } = useTranslation();

  const loadMore = useCallback(() => {
    if (status !== "loading") {
      dispatch(fetchSavedReels());
    }
  }, [dispatch, status]);

  return (
    <ScrollViewContainer className="overflow-y-auto">
      {reels.length === 0 && !isLoading && (
        <NoContentDisplay
          text={t("empty_saved_reels")}
          iconSrc="/icon/save-light.svg"
          textClassName="w-[192px]"
        />
      )}
      <InfiniteScrollList
        loading={isLoading}
        fetchData={loadMore}
        hasMore={hasMore}
        error={error}
        className="w-full h-full"
      >
        <ReelDisplayContainer>
          {reels.map((video) => (
            <div key={video.id}>
              {video.isSubscribed ? (
                <Link to={`/saved/${video.id}`}>
                  <VideoThumbnail video={video} locked={false} />
                </Link>
              ) : (
                <VideoThumbnail
                  video={video}
                  locked={true}
                  onClick={() =>
                    video.creatorId && openSubscribeCheckout(video.creatorId)
                  }
                  className="cursor-pointer"
                />
              )}
            </div>
          ))}
        </ReelDisplayContainer>
      </InfiniteScrollList>
    </ScrollViewContainer>
  );
};

export default SavedReelsPage;
