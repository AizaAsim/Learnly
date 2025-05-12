import { mux } from "./mux";
import { stripe } from "./stripe";
import { connectedStripe } from "./stripe-connect";
export const webhooks = { mux, stripe, connectedStripe };
