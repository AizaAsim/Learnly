import { Spinner } from "@/components/ui/spinner";
import { ReelDisplayContainer } from "@/features/Videos/components/ReelDisplayContainer";
import { VideoThumbnail } from "@/features/Videos/components/VideoThumbnail";
import { AppDispatch } from "@/store";
import { fetchCreatorVideos } from "@/store/reducers/creatorProfileReducer";
import {
  selectCreatorId,
  selectCreatorVideos,
  selectIsSubscribed,
  selectVideosLoading,
} from "@/store/selectors/creatorProfileSelectors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface CreatorVideosProp {
  username: string;
}

export const CreatorVideos = ({ username }: CreatorVideosProp) => {
  const dispatch = useDispatch<AppDispatch>();
  const creatorVideos = useSelector(selectCreatorVideos);
  const videosLoading = useSelector(selectVideosLoading);
  const isSubscribed = useSelector(selectIsSubscribed);
  const creatorId = useSelector(selectCreatorId);

  useEffect(() => {
    if (username) dispatch(fetchCreatorVideos(username));
  }, [username, dispatch]);

  if (videosLoading) return <Spinner />;

  if (!creatorId) return null;

  return (
    <ReelDisplayContainer>
      {creatorVideos.map((video) => (
        <div key={video.id}>
          <Link to={`/${username}/${video.id}`}>
            <VideoThumbnail video={video} locked={!isSubscribed} />
          </Link>
        </div>
      ))}
    </ReelDisplayContainer>
  );
};
