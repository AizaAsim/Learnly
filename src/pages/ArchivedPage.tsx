import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { ReelDisplayContainer } from "@/features/Videos/components/ReelDisplayContainer";
import { VideoThumbnail } from "@/features/Videos/components/VideoThumbnail";
import { AppDispatch } from "@/store";
import { fetchMyVideoData } from "@/store/reducers/myVideosReducer";
import {
  selectLastUpdated,
  selectReels,
  selectSortedArchived,
} from "@/store/selectors/myVideoSelectors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ArchivedPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const archivedVideos = useSelector(selectSortedArchived);
  const reels = useSelector(selectReels);
  const lastUpdated = useSelector(selectLastUpdated);

  useEffect(() => {
    if (reels.length === 0 && lastUpdated === 0) dispatch(fetchMyVideoData());
  }, [dispatch, reels, lastUpdated]);

  return (
    <ScrollViewContainer className="overflow-y-auto">
      <ReelDisplayContainer>
        {archivedVideos.map((v) => {
          return (
            <Link to={`/my-profile/archived/${v.id}`} key={v.id}>
              <VideoThumbnail video={v} locked={false} />
            </Link>
          );
        })}
      </ReelDisplayContainer>
    </ScrollViewContainer>
  );
};

export default ArchivedPage;
