import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useDocumentOnce } from "@/hooks/useDocumentOnce";
import { firestore } from "@/services/firebase";
import { logError, logInfo } from "@/services/logging";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeError } from "@stripe/stripe-js";
import { doc, onSnapshot } from "firebase/firestore";
import { FormEvent, useCallback, useReducer } from "react";
import { createSubscription, saveCustomerCard } from "../services/callable";
import { PaymentMethod, StripeUserData } from "../types";

type CheckoutState = {
  cardHolderName: string;
  error: string;
  isSubmitting: boolean;
  useExistingCard: boolean;
};

type CheckoutAction =
  | { type: "SET_CARD_HOLDER_NAME"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_IS_SUBMITTING"; payload: boolean }
  | { type: "SET_USE_EXISTING_CARD"; payload: boolean }
  | { type: "RESET_ERROR" };

const initialState: CheckoutState = {
  cardHolderName: "",
  error: "",
  isSubmitting: false,
  useExistingCard: true,
};

const checkoutReducer = (
  state: CheckoutState,
  action: CheckoutAction
): CheckoutState => {
  switch (action.type) {
    case "SET_CARD_HOLDER_NAME":
      return { ...state, cardHolderName: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_USE_EXISTING_CARD":
      return { ...state, useExistingCard: action.payload };
    case "RESET_ERROR":
      return { ...state, error: "" };
    default:
      return state;
  }
};

export const useCheckout = (
  creatorId?: string,
  onSuccessfulSubscription?: () => void
) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  const { document: stripeUser } = useDocumentOnce<StripeUserData>(
    "stripe_users",
    user?.uid || ""
  );
  const savedCardId = stripeUser?.activePaymentMethodId;
  const { document: savedCard } = useDocumentOnce<PaymentMethod>(
    `stripe_users/${user?.uid}/payment_methods`,
    savedCardId || ""
  );

  const handleError = useCallback((error: unknown) => {
    logError(error);

    let message = "An error occurred. Please try again.";

    if (error instanceof Error) {
      message = error.message;
    } else if ((error as StripeError)?.message) {
      message = (error as StripeError).message!;
    }

    dispatch({ type: "SET_ERROR", payload: message });
    dispatch({ type: "SET_IS_SUBMITTING", payload: false });
  }, []);

  const startFormSubmission = useCallback(() => {
    dispatch({ type: "RESET_ERROR" });
    dispatch({ type: "SET_IS_SUBMITTING", payload: true });
  }, []);

  const handleSuccessfulSubscription = useCallback(() => {
    dispatch({ type: "SET_IS_SUBMITTING", payload: false });
    onSuccessfulSubscription?.();
  }, [onSuccessfulSubscription]);

  const handleNewCardSubscription = useCallback(async () => {
    if (!stripe || !elements || !user || !creatorId) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement || !state.cardHolderName) return;
    startFormSubmission();
    try {
      const { data } = await saveCustomerCard({ creatorId });
      if (!data.client_secret) return;

      const { error } = await stripe.confirmCardSetup(data.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: state.cardHolderName },
        },
      });

      if (error) throw error;

      const stripeCustomerDocRef = doc(
        firestore,
        "stripe_users",
        user.uid,
        "stripe_customers",
        creatorId
      );
      const unsubscribe = onSnapshot(stripeCustomerDocRef, async (doc) => {
        const data = doc.data();
        if (data?.paymentMethodId) {
          unsubscribe();
          await createSubscription({ creatorUid: creatorId });
          handleSuccessfulSubscription();
        }
      });
    } catch (error) {
      handleError(error);
    }
  }, [
    stripe,
    elements,
    user,
    creatorId,
    state.cardHolderName,
    handleError,
    handleSuccessfulSubscription,
    startFormSubmission,
  ]);

  const handleSubscriptionSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user || !creatorId) {
        toast({
          text: user ? "Educator ID not found." : "User not authenticated.",
        });
        return;
      }

      try {
        if (state.useExistingCard && savedCard) {
          startFormSubmission();
          await createSubscription({ creatorUid: creatorId });
          handleSuccessfulSubscription();
        } else {
          await handleNewCardSubscription();
        }
      } catch (error) {
        handleError(error);
        dispatch({ type: "SET_IS_SUBMITTING", payload: false });
      }
    },
    [
      user,
      creatorId,
      state.useExistingCard,
      savedCard,
      handleNewCardSubscription,
      handleSuccessfulSubscription,
      handleError,
      toast,
      startFormSubmission,
    ]
  );

  const handleSaveNewCard = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user || !stripe || !elements) {
        toast({
          text: "User not authenticated or Stripe not initialized.",
        });
        return false;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement || !state.cardHolderName) return false;

      dispatch({ type: "RESET_ERROR" });
      dispatch({ type: "SET_IS_SUBMITTING", payload: true });

      try {
        const { data } = await saveCustomerCard();
        const { setupIntent, error } = await stripe.confirmCardSetup(
          data.client_secret,
          {
            payment_method: {
              card: cardElement,
              billing_details: { name: state.cardHolderName },
              metadata: { firestoreUid: user.uid },
            },
          }
        );

        if (error) throw error;

        logInfo(setupIntent);
        toast({
          text: "Card saved successfully!",
          variant: "success",
          className: "w-56",
        });
        dispatch({ type: "SET_IS_SUBMITTING", payload: false });
        return true;
      } catch (error) {
        handleError(error);
        return false;
      }
    },
    [user, stripe, elements, state.cardHolderName, handleError, toast]
  );

  const setCardHolderName = useCallback(
    (name: string) => dispatch({ type: "SET_CARD_HOLDER_NAME", payload: name }),
    []
  );

  const setUseExistingCard = useCallback(
    (use: boolean) => dispatch({ type: "SET_USE_EXISTING_CARD", payload: use }),
    []
  );

  return {
    ...state,
    setCardHolderName,
    setUseExistingCard,
    handleSubscriptionSubmit,
    handleSaveNewCard,
    stripe,
    elements,
    savedCard,
  };
};
