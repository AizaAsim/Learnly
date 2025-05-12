import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import { Spinner } from "@/components/ui/spinner";
import {
  selectBlockedReel,
  selectBlockedReelError,
  selectBlockedReelStatus,
} from "@/store/selectors/blockedReelSelectors";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSubmitAppealModals } from "../hooks/useSubmitAppealModals";
import { router } from "@/router";
import { useModal } from "@/hooks/useModal";
import { PostCard } from "@/components/PostCard";

export const PostRemoved = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "post_removed" });
  const loading = useSelector(selectBlockedReelStatus) === "loading";
  const error = useSelector(selectBlockedReelError);
  const reelData = useSelector(selectBlockedReel);
  const { openSubmitAppealModal } = useSubmitAppealModals();
  const { setOnCloseModal, closeModal } = useModal();

  if (loading) return <Spinner className="h-[250px]" />;

  if (error) <Error>{error}</Error>;

  const blockedReason = reelData?.blockedReason;

  const openRemovedReel = () => {
    setOnCloseModal(undefined);
    closeModal();
    router.navigate(`/removed/${reelData?.id}`);
  };

  return (
    <div className="max-w-[327px] mx-auto md:max-w-full">
      {blockedReason && (
        <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-[14px] bg-grayscale-4 mb-[14px]">
          <img className="size-6" src="/icon/danger.svg" alt="danger" />
          <p>{blockedReason}</p>
        </div>
      )}
      {reelData && <PostCard reelData={reelData} onClick={openRemovedReel} />}
      <div className="flex flex-col gap-4">
        <Button>{t("review_button")}</Button>
        <Button
          variant="ghost"
          size="none"
          onClick={() => openSubmitAppealModal()}
        >
          {t("submit_appeal_button")}
        </Button>
      </div>
    </div>
  );
};
