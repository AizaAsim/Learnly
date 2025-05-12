import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { logError } from "@/services/logging";
import { Elements } from "@stripe/react-stripe-js";
import { useCallback, useState } from "react";
import { SubscriptionCheckout } from "../components/SubscriptionCheckout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchCreatorProfile,
  fetchCreatorVideos,
} from "@/store/reducers/creatorProfileReducer";
import {
  selectCreatorProfileData,
  selectCreatorUsername,
} from "@/store/selectors/creatorProfileSelectors";
import { CheckoutTitle } from "../components/SubscriptionCheckout/CheckoutTitle";
import { CheckoutSubtitle } from "../components/SubscriptionCheckout/CheckoutSubtitle";
import { useSuccessfulSubscribeModal } from "./useSuccessfulSubscribeModal";
import { useAuthModals } from "@/features/Auth/hooks/useAuthModals";
import { getStripe } from "@/features/Stripe/services/stripe";

export const useSubscribeModal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { openAuthModal } = useAuthModals();
  const { setModal, openModal } = useModal();
  const { openSuccessfulSubscribeModal } = useSuccessfulSubscribeModal();
  const dispatch = useDispatch<AppDispatch>();
  const creatorUsername = useSelector(selectCreatorUsername);
  const creatorProfile = useSelector(selectCreatorProfileData);
  const creatorName =
    creatorProfile?.displayName || creatorUsername || "Educator";

  const handleSuccessfulSubscription = useCallback(() => {
    if (creatorUsername) {
      dispatch(fetchCreatorVideos(creatorUsername));
      dispatch(fetchCreatorProfile(creatorUsername));
    }
    openSuccessfulSubscribeModal();
  }, [creatorUsername, dispatch, openSuccessfulSubscribeModal]);

  const openSubscribeCheckout = useCallback(
    async (creatorUid: string) => {
      if (!user?.uid) {
        openAuthModal();
        setError(new Error("User not authenticated"));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        setModal(
          <Elements stripe={getStripe()}>
            <SubscriptionCheckout
              creatorId={creatorUid}
              onSuccessfulSubscription={handleSuccessfulSubscription}
            />
          </Elements>,
          {
            title: <CheckoutTitle creatorName={creatorName} />,
            subtitle: <CheckoutSubtitle creatorName={creatorName} />,
            avatar: {
              imageUrl: creatorProfile?.avatar_url || undefined,
              icon: "/icon/subscribe-circular-star.svg",
            },
          },
          { showBackIcon: false }
        );
        openModal();
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error("An unknown error occurred")
        );
        logError(error);
      } finally {
        setLoading(false);
      }
    },
    [
      user?.uid,
      openAuthModal,
      setModal,
      openModal,
      handleSuccessfulSubscription,
      creatorName,
      creatorProfile?.avatar_url,
    ]
  );

  return { openSubscribeCheckout, loading, error };
};
