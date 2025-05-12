import { Elements } from "@stripe/react-stripe-js";
import PaymentMethodPage from "./PaymentMethodPage";
import { getStripe } from "@/features/Stripe/services/stripe";

function StripePaymentMethodPage() {
  return (
    <Elements stripe={getStripe()}>
      <PaymentMethodPage />
    </Elements>
  );
}

export default StripePaymentMethodPage;
