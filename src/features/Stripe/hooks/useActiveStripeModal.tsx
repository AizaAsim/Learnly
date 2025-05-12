import { useAuth } from "@/features/Auth/hooks/useAuth";
import { Roles } from "@/features/Auth/types";
import { useModal } from "@/hooks/useModal";
import { firestore } from "@/services/firebase";
import { logError } from "@/services/logging";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { StripeActiveModal } from "../components/StripeActiveModal";
import { CreatorStripeData } from "../types";
import { useTranslation } from "react-i18next";

// Array of routes to exclude
const excludedRoutes = ["/preview/:id"];

export const useActiveStripeModal = () => {
  const { user } = useAuth();
  const { setModal, openModal, setOnCloseModal, isOpen, setIsOpen } =
    useModal();
  const location = useLocation();
  const { t } = useTranslation();

  // Check if the current route matches any excluded route
  const isOnExcludedRoute = useMemo(
    () => excludedRoutes.some((route) => matchPath(route, location.pathname)),
    [location.pathname]
  );

  useEffect(() => {
    if (
      !user?.uid ||
      user?.role !== Roles.CREATOR ||
      isOpen || // Ensure no other modal is currently open
      isOnExcludedRoute // Ensure user is not on any excluded route
    )
      return;

    const stripeDocRef = doc(firestore, "stripe", user.uid);

    const unsubscribe = onSnapshot(
      stripeDocRef,
      async (docSnap) => {
        if (!docSnap.exists()) return;

        try {
          const data = docSnap.data() as CreatorStripeData;
          const { payouts_enabled, charges_enabled, hasShownActivationModal } =
            data;

          if (payouts_enabled && charges_enabled && !hasShownActivationModal) {
            const makeFlagTrue = async () =>
              await setDoc(
                stripeDocRef,
                { hasShownActivationModal: true },
                { merge: true }
              );
            setOnCloseModal(async () => {
              await makeFlagTrue();
              setIsOpen(false);
            });
            // Copying link signals user has digested the message so make hasShownActivationModal true
            setModal(<StripeActiveModal onCopy={makeFlagTrue} />, {
              title: t("subscritionActivated.title"),
              subtitle: t("subscritionActivated.description"),
              avatar: { imageUrl: user?.avatar_url || "/img/avatar.png" },
            });

            openModal();
          }
        } catch (error) {
          logError("Error handling Stripe real-time updates:", error);
        }
      },
      (error) => {
        logError("Error subscribing to Stripe updates:", error);
      }
    );

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [
    user,
    setModal,
    openModal,
    setOnCloseModal,
    isOpen,
    setIsOpen,
    location,
    isOnExcludedRoute,
    t,
  ]);
};
