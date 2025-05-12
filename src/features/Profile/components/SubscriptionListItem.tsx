import { UserListItem } from "@/components/UserListItem";
import { AppDispatch } from "@/store";
import { fetchCreatorDetails } from "@/store/reducers/creatorDetailsReducer";
import {
  selectCreatorDetailsError,
  selectCreatorDetailsLoading,
  selectReelCreatorById,
} from "@/store/selectors/creatorDetailsSelectors";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface SubscriptionListItemProps {
  creatorId: string;
}

export const SubscriptionListItem = ({
  creatorId,
}: SubscriptionListItemProps) => {
  const navigate = useNavigate();
  const creator = useSelector(selectReelCreatorById(creatorId));
  const loading = useSelector(selectCreatorDetailsLoading);
  const error = useSelector(selectCreatorDetailsError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!creator) {
      dispatch(fetchCreatorDetails(creatorId));
    }
  }, [creator, creatorId, dispatch]);

  return (
    <UserListItem
      loading={loading}
      error={error as string}
      leftTopContent={
        <>
          <p>{creator?.displayName}</p>
          {creator?.isVerified && (
            <img
              src="/icon/verification-badge.svg"
              className="w-[18px] h-[18px] md:w-5 md:h-5"
            />
          )}
        </>
      }
      leftBottomContent={creator?.username}
      onClick={() => creator && navigate(`/${creator.username}`)}
      avatarUrl={creator?.avatar_url || null}
      rightContent={
        <img src="/icon/chevron-right.svg" className="w-5 h-5 md:w-6 md:h-6" />
      }
    />
  );
};
