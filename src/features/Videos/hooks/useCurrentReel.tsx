import { useAuth } from "@/features/Auth/hooks/useAuth";
import { RootState } from "@/store";
import { selectCurrentReel } from "@/store/selectors/reelSelectors";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export function useCurrentReel() {
  const location = useLocation();
  const { user } = useAuth();

  const id = useMemo(
    () => location.pathname.split("/").pop() || "",
    [location.pathname]
  );

  const reel = useSelector((state: RootState) =>
    selectCurrentReel(state, location.pathname, id, user)
  );

  const url = useMemo(() => {
    return `${import.meta.env.VITE_BASE_URL}/${reel?.creator?.username}/${reel?.id}`;
  }, [reel?.creator?.username, reel?.id]);

  return { id, reel, url };
}
