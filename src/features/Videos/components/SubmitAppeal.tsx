import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { firestore } from "@/services/firebase";
import { logError } from "@/services/logging";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubmitAppealModals } from "../hooks/useSubmitAppealModals";
import { useModal } from "@/hooks/useModal";
import { useSelector } from "react-redux";
import {
  selectBlockedReel,
  selectBlockedReelId,
} from "@/store/selectors/blockedReelSelectors";

const maxCommentLength = 120;

export const SubmitAppeal = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "submit_appeal" });
  const { openAppealSubmittedModal } = useSubmitAppealModals();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { closeModal } = useModal();
  const reelId = useSelector(selectBlockedReelId);
  const reelData = useSelector(selectBlockedReel);

  const checkExistingAppeal = useCallback(
    async (creatorId: string, reelId: string) => {
      const appealsRef = collection(firestore, "creators-appeals");
      const q = query(
        appealsRef,
        where("creatorId", "==", creatorId),
        where("reelId", "==", reelId)
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    },
    []
  );

  const handleSubmitAppeal = useCallback(async () => {
    try {
      if (!user) return;
      if (!reelData?.isBlocked) {
        toast({ text: "EduClip is already restored", variant: "destructive" });
        return;
      }

      setIsSubmitting(true);

      // Check for existing appeal
      const hasExistingAppeal = await checkExistingAppeal(user.uid, reelId);
      if (hasExistingAppeal) {
        toast({
          text: "Appeal already submitted for this reel",
          variant: "destructive",
        });
        return;
      }

      // Create a new appeal
      const collectionRef = collection(firestore, "creators-appeals");
      await addDoc(collectionRef, {
        reelId,
        comment,
        appealedAt: new Date(),
        creatorId: user.uid,
      });

      openAppealSubmittedModal();
    } catch (error) {
      logError(error);
      toast({ text: "Failed to submit appeal", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    user,
    reelData?.isBlocked,
    reelId,
    comment,
    toast,
    checkExistingAppeal,
    openAppealSubmittedModal,
  ]);

  return (
    <div className="max-w-[327px] mx-auto md:max-w-full">
      <div className="mb-4 relative">
        <Textarea
          className="border-[1.6px] border-transparent focus:border-grayscale-100"
          placeholder={t("placeholder")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={maxCommentLength}
        />
        <span className="absolute bottom-2.5 right-3 text-[11px] text-grayscale-40 font-medium">
          {`${comment.length}/${maxCommentLength}`}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <Button loading={isSubmitting} onClick={handleSubmitAppeal}>
          {t("submit")}
        </Button>
        <Button variant="ghost" size="none" onClick={closeModal}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
};
