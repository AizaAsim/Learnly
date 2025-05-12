import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import { Spinner } from "@/components/ui/spinner";
import { useModal } from "@/hooks/useModal";
import {
  selectBlockedReel,
  selectBlockedReelError,
  selectBlockedReelStatus,
} from "@/store/selectors/blockedReelSelectors";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const PostRestored = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "post_restored" });
  const loading = useSelector(selectBlockedReelStatus) === "loading";
  const error = useSelector(selectBlockedReelError);
  const reelData = useSelector(selectBlockedReel);
  const { closeModal } = useModal();

  if (loading) return <Spinner className="h-[250px]" />;

  if (error) <Error>{error}</Error>;

  return (
    <div className="max-w-[327px] mx-auto md:max-w-full">
      {reelData && <PostCard reelData={reelData} className="mb-3.5" />}
      <p className="text-grayscale-60 font-medium leading-[22px] -tracking-[0.16px] text-center mb-8">
        {t("details")}
      </p>
      <Button className="w-full" onClick={closeModal}>
        {t("button")}
      </Button>
    </div>
  );
};
