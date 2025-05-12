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
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const PostDeleted = () => {
  const { t } = useTranslation();
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
        <Trans
          i18nKey="post_deleted.details"
          components={{
            underline: (
              <a
                className="underline font-semibold text-grayscale-80"
                href="#"
              />
            ),
          }}
        />
      </p>
      <Button className="w-full" onClick={closeModal}>
        {t("post_deleted.button")}
      </Button>
    </div>
  );
};
