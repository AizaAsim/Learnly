import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/features/Stripe/services/stripe";
import { useLocation } from "react-router-dom";
export const CheckoutSession = () => {
  const { state: clientSecret } = useLocation();

  return (
    <div className="m-4">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
