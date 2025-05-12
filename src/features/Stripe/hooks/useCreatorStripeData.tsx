import { useState, useEffect } from "react";
import { firestore } from "@/services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Roles } from "@/features/Auth/types";
import { logWarning } from "@/services/logging";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { CreatorStripeData } from "../types";

interface UseCreatorStripeStatusResult {
  stripeData: CreatorStripeData | null;
  isLoading: boolean;
  error: Error | null;
}

export const useCreatorStripeData = (): UseCreatorStripeStatusResult => {
  const { user, isLoggedIn } = useAuth();
  const [stripeData, setStripeData] = useState<CreatorStripeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user?.uid || user.role !== Roles.CREATOR) {
      setStripeData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const docRef = doc(firestore, "stripe", user.uid);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as CreatorStripeData;
          setStripeData(data);
        } else {
          logWarning("No stripe data associated with the creator.");
          setStripeData(null);
        }
        setIsLoading(false);
      },
      (err) => {
        logWarning("Error fetching Stripe data", err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isLoggedIn, user]);

  return { stripeData, isLoading, error };
};
