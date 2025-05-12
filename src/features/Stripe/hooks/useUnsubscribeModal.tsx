import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { logError } from "@/services/logging";
import { useCallback, useState } from "react";
import { UnsubscribeCreator } from "../components/UnsubscribeCreatorModal";
import { unsubscribeCreator } from "../services/callable";
import { useDispatch, useSelector } from "react-redux";
import { selectCreatorProfileData } from "@/store/selectors/creatorProfileSelectors";
import { updateCancelAtPeriodEnd } from "@/store/reducers/creatorProfileReducer";
import { AppDispatch } from "@/store";

export const useUnsubscribeModal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { setModal, openModal, closeModal } = useModal();
  const { toast } = useToast();
  const creatorProfile = useSelector(selectCreatorProfileData);
  const dispatch = useDispatch<AppDispatch>();

  const handleUnsubscribe = useCallback(
    async (creatorId: string) => {
      try {
        await unsubscribeCreator({ creatorId });
        dispatch(updateCancelAtPeriodEnd(true));
      } catch (error) {
        let message = "Failed to unsubscribe";
        if (error instanceof Error) message = error.message;
        toast({ text: message, variant: "destructive" });
        throw error;
      }
    },
    [toast, dispatch]
  );

  const openUnsubscribeModal = useCallback(
    async (creatorId: string) => {
      setLoading(true);
      setError(null);

      try {
        if (!user?.uid) throw new Error("User not authenticated");

        setModal(
          <UnsubscribeCreator
            onClose={() => closeModal()}
            onConfirm={() => handleUnsubscribe(creatorId)}
            creatorId={creatorId}
            userId={user.uid}
          />,
          {
            avatar: {
              imageUrl: creatorProfile?.avatar_url || undefined,
              icon: "/icon/cross-circular-red.svg",
            },
          }
        );
        openModal();
      } catch (error) {
        setError(error as Error);
        logError(error);
      } finally {
        setLoading(false);
      }
    },
    [
      user,
      setModal,
      openModal,
      handleUnsubscribe,
      closeModal,
      creatorProfile?.avatar_url,
    ]
  );

  return { openUnsubscribeModal, loading, error };
};
