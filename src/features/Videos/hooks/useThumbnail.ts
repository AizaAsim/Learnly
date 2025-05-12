import { firestore } from "@/services/firebase";
import { AppDispatch } from "@/store";
import { getThumbnails } from "@/store/reducers/reelUploadReducer";
import {
  selectSelectedThumbnail,
  selectThumbnails,
  selectVideo,
} from "@/store/selectors/reelUploadSelectors";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useThumbnail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const thumbnails = useSelector(selectThumbnails);
  const selectedThumbnail = useSelector(selectSelectedThumbnail);
  const video = useSelector(selectVideo);

  useEffect(() => {
    if (video?.id && thumbnails.length === 0) {
      dispatch(getThumbnails());
    }
  }, [video?.id, dispatch, thumbnails]);

  useEffect(() => {
    if (selectedThumbnail && video?.id) {
      (async () => {
        const reelRef = doc(firestore, `reels/${video.id}`);
        await updateDoc(reelRef, {
          thumbnailFrameSecond: selectedThumbnail.time,
        });
      })();
    }
  }, [selectedThumbnail, video?.id]);

  return {
    thumbnails,
    selectedThumbnail,
  };
};
