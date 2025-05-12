import { useNavigate } from "react-router-dom";
import { UserListItem } from "@/components/UserListItem";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCreatorDetailsError,
  selectCreatorDetailsLoading,
  selectReelCreatorById,
} from "@/store/selectors/creatorDetailsSelectors";
import { AppDispatch } from "@/store";
import { useEffect } from "react";
import { fetchCreatorDetails } from "@/store/reducers/creatorDetailsReducer";
import { CreatorInfo } from "@/types";

interface SearchListItemProps {
  creator: CreatorInfo;
}

export const SearchListItem = ({ creator: c }: SearchListItemProps) => {
  const { id: creatorId } = c;
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
      error={(error as Error)?.message}
      leftTopContent={
        <>
          <p className="lowercase">{c?.username}</p>
          {creator?.isVerified && (
            <img
              src="/icon/verification-badge.svg"
              className="w-[18px] h-[18px] md:w-5 md:h-5"
            />
          )}
        </>
      }
      leftBottomContent={c?.displayName}
      onClick={() => navigate(`/${c?.username}`)}
      avatarUrl={c?.avatar_url || null}
    />
  );
};
