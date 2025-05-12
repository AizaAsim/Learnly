import { HeaderMenu } from "@/features/Videos/components/ReelHeader/HeaderMenu";
import { ActiveMenu } from "@/features/Videos/components/ReelHeader/Menus/ActiveMenu";
import { ArchivedMenu } from "@/features/Videos/components/ReelHeader/Menus/ArchivedMenu";
import { DraftMenu } from "@/features/Videos/components/ReelHeader/Menus/DraftMenu";
import { ScheduledMenu } from "@/features/Videos/components/ReelHeader/Menus/ScheduledMenu";
import { UserMenu } from "@/features/Videos/components/ReelHeader/Menus/UserMenu";
import { store } from "@/store";
import { fetchHomeReels } from "@/store/reducers/homeReelsReducer";
import { fetchMyVideoData } from "@/store/reducers/myVideosReducer";
import {
  clearSavedReels,
  fetchSavedReels,
} from "@/store/reducers/savedReelsReducer";
import { selectBlockedReels } from "@/store/selectors/blockedReelSelectors";
import { selectCreatorVideos } from "@/store/selectors/creatorProfileSelectors";
import { selectHomeReels } from "@/store/selectors/homeReelsSelectors";
import {
  selectSortedActive,
  selectSortedArchived,
  selectSortedDrafts,
  selectSortedScheduled,
} from "@/store/selectors/myVideoSelectors";
import { selectPreviewVideos } from "@/store/selectors/reelUploadSelectors";
import { selectSubscribedSavedReels } from "@/store/selectors/savedReelsSelectors";
import { Params } from "react-router-dom";

export const preloadMyReels = async ({
  params,
}: {
  params: Params<string>;
}) => {
  const { id, type } = params;
  if (!type || !id) {
    throw new Response("Not Found", { status: 404 });
  }

  await store.dispatch(fetchMyVideoData());

  switch (type) {
    case "active":
      return {
        id,
        menu: <ActiveMenu />,
        selector: selectSortedActive,
      };
    case "draft":
      return {
        id,
        menu: <DraftMenu />,
        selector: selectSortedDrafts,
      };
    case "scheduled":
      return {
        id,
        menu: <ScheduledMenu />,
        selector: selectSortedScheduled,
      };
    case "archived":
      return {
        id,
        menu: <ArchivedMenu />,
        selector: selectSortedArchived,
      };
    default:
      throw new Response("Not Found", { status: 404 });
  }
};

export const preloadCuratedReels = async () => {
  await store.dispatch(fetchHomeReels());
  const reels = selectHomeReels(store.getState());
  return {
    id: reels[0]?.id,
    menu: <UserMenu />,
    selector: selectHomeReels,
  };
};

export const preloadCreatorReels = async ({
  params,
}: {
  params: Params<string>;
}) => {
  const { id, username } = params;
  if (!id || !username) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    id,
    menu: <UserMenu />,
    selector: selectCreatorVideos,
  };
};

export const preloadPreviewReel = async ({ params }: { params: Params }) => {
  const { id } = params;
  if (!id) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    id,
    menu: <HeaderMenu />, // Empty menu
    selector: selectPreviewVideos,
  };
};

export const preloadBlockedReel = async ({ params }: { params: Params }) => {
  const { id } = params;
  if (!id) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    id,
    menu: <div />, // Empty menu
    selector: selectBlockedReels,
  };
};

export const preloadSavedReels = async ({ params }: { params: Params }) => {
  const { id } = params;
  store.dispatch(clearSavedReels());
  await store.dispatch(fetchSavedReels());
  return {
    id: id || "",
    menu: <UserMenu />,
    selector: selectSubscribedSavedReels,
  };
};
