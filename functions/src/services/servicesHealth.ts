import axios from "axios";
import { ServiceHealth, StatusAPIResponse } from "../types";
import { getMeiliSearchClient } from "./meilisearch";
import { getMux } from "./mux";
import { getStripeInstance } from "./stripe";

export const muxHealth = async (): Promise<ServiceHealth> => {
  try {
    const { mux } = getMux();
    // Dummy call to check health
    await mux.video.assets.list({ limit: 1 });
    return { status: "UP", name: "Mux" };
  } catch (error) {
    let message = "Failed to connect to Mux";
    if (error instanceof Error) message = error.message;
    return { status: "DOWN", name: "Mux", error: message };
  }
};

export const meiliSearchHealth = async (): Promise<ServiceHealth> => {
  try {
    const client = getMeiliSearchClient();
    await client.health();
    return { status: "UP", name: "MeiliSearch" };
  } catch (error) {
    let message = "Failed to connect to meiliSearch";
    if (error instanceof Error) message = error.message;
    return { status: "DOWN", name: "MeiliSearch", error: message };
  }
};

export const stripeHealth = async (): Promise<ServiceHealth> => {
  try {
    const stripe = getStripeInstance();
    // Dummy call to check health
    await stripe.accounts.retrieve();
    return { status: "UP", name: "Stripe" };
  } catch (error) {
    let message = "Failed to connect to Stripe";
    if (error instanceof Error) message = error.message;
    return { status: "DOWN", name: "Stripe", error: message };
  }
};

const checkTwilioOrSendgridHealth = async (
  serviceName: "Twilio" | "Sendgrid",
  apiUrl: string,
  componentsWeCareAbout: string[]
): Promise<ServiceHealth> => {
  try {
    const response = await axios.get<StatusAPIResponse>(apiUrl);
    const components = response.data.components;

    const problematicComponent = components.find(
      (component) =>
        componentsWeCareAbout.includes(component.name) &&
        component.status === "major_outage"
    );

    if (problematicComponent) {
      return {
        status: "DOWN",
        name: serviceName,
        error: `${problematicComponent.name} is in major outage`,
      };
    }

    return { status: "UP", name: serviceName };
  } catch (error) {
    let message = `Failed to connect to ${serviceName}`;
    if (error instanceof Error) message = error.message;
    return { status: "DOWN", name: serviceName, error: message };
  }
};

export const twilioHealth = () =>
  checkTwilioOrSendgridHealth(
    "Twilio",
    "https://status.twilio.com/api/v2/components.json",
    ["Verify"]
  );

export const sendgridHealth = () =>
  checkTwilioOrSendgridHealth(
    "Sendgrid",
    "https://status.sendgrid.com/api/v2/components.json",
    ["Mail Sending"]
  );
