import { Stripe } from '@stripe/stripe-js';

let stripeInstance: Promise<Stripe | null>;

export const getStripe = async () => {
  if (!stripeInstance) {
    const { loadStripe } = await import('@stripe/stripe-js');
    stripeInstance = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) as Promise<Stripe>;
  }
  return stripeInstance;
};