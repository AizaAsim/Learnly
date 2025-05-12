import { VideoThumbnailLink } from "./VideoThumbnailLink";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLastUpdated,
  selectReels,
  selectSortedActive,
  selectSortedArchived,
  selectSortedDrafts,
  selectSortedScheduled,
} from "@/store/selectors/myVideoSelectors";
import { VideoThumbnail } from "@/features/Videos/components/VideoThumbnail";
import { Link } from "react-router-dom";
import { AppDispatch } from "@/store";
import { useEffect } from "react";
import { fetchMyVideoData } from "@/store/reducers/myVideosReducer";
import { AddReelProfileButton } from "./AddReel";
import { ReelDisplayContainer } from "@/features/Videos/components/ReelDisplayContainer";

export const MyVideos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const draftVideos = useSelector(selectSortedDrafts);
  const scheduledVideos = useSelector(selectSortedScheduled);
  const activeVideos = useSelector(selectSortedActive);
  const archivedVideos = useSelector(selectSortedArchived);
  const reels = useSelector(selectReels);
  const lastUpdated = useSelector(selectLastUpdated);

  useEffect(() => {
    if (reels.length === 0 && lastUpdated === 0) dispatch(fetchMyVideoData());
  }, [dispatch, reels, lastUpdated]);

  if (
    draftVideos.length === 0 &&
    scheduledVideos.length === 0 &&
    activeVideos.length === 0 &&
    archivedVideos.length === 0
  ) {
    return <AddReelProfileButton />;
  }

  return (
    <ReelDisplayContainer>
      {draftVideos.length > 0 && (
        <Link to={`/my-profile/draft`} key={draftVideos[0]?.id}>
          <VideoThumbnailLink
            src={draftVideos[0]?.thumbnail}
            text={`Drafts: ${draftVideos.length}`}
          />
        </Link>
      )}
      {scheduledVideos.length > 0 && (
        <Link to={`/my-profile/scheduled`} key={scheduledVideos[0]?.id}>
          <VideoThumbnailLink
            src={scheduledVideos[0]?.thumbnail}
            text={`Scheduled: ${scheduledVideos?.length}`}
          />
        </Link>
      )}
      {archivedVideos.length > 0 && (
        <Link to={`/my-profile/archived`} key={archivedVideos[0]?.id}>
          <VideoThumbnailLink
            src={archivedVideos[0]?.thumbnail}
            text={`Archive: ${archivedVideos?.length}`}
          />
        </Link>
      )}
      {/* List of other videos */}
      {activeVideos.length > 0 &&
        activeVideos.map((video) => (
          <Link to={`/my-profile/active/${video.id}`} key={video.id}>
            <VideoThumbnail video={video} locked={false} />
          </Link>
        ))}
    </ReelDisplayContainer>
  );
};
