import { ScrollViewContainer } from "@/components/wrapper/ScrollViewContainer";
import { ReelDisplayContainer } from "@/features/Videos/components/ReelDisplayContainer";
import { VideoThumbnail } from "@/features/Videos/components/VideoThumbnail";
import { AppDispatch } from "@/store";
import { fetchMyVideoData } from "@/store/reducers/myVideosReducer";
import {
  selectLastUpdated,
  selectReels,
  selectSortedScheduled,
} from "@/store/selectors/myVideoSelectors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ScheduledPage = () => {
  const scheduledvideos = useSelector(selectSortedScheduled);
  const reels = useSelector(selectReels);
  const lastUpdated = useSelector(selectLastUpdated);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (reels.length === 0 && lastUpdated === 0) dispatch(fetchMyVideoData());
  }, [dispatch, reels, lastUpdated]);

  return (
    <ScrollViewContainer className="overflow-y-auto">
      <ReelDisplayContainer>
        {scheduledvideos.map((v) => {
          return (
            <Link to={`/my-profile/scheduled/${v.id}`} key={v.id}>
              <VideoThumbnail video={v} locked={false} />
            </Link>
          );
        })}
      </ReelDisplayContainer>
    </ScrollViewContainer>
  );
};

export default ScheduledPage;
