import { HttpsError } from "firebase-functions/https";
import { WebflowClient } from "webflow-api";
import { logError } from "./logging";

const SITE_ID = "HOSTED_SITE_ID";
const COLLECTION_ID = "HOSTED_SITE_COLLECTION_ID";

const getWebflowApiClient = () => {
  const { WEBFLOW_API_ACCESS_TOKEN } = process.env;

  if (!WEBFLOW_API_ACCESS_TOKEN) {
    throw new HttpsError("internal", "Something went wrong!");
  }

  const webflowApiClient = new WebflowClient({
    accessToken: WEBFLOW_API_ACCESS_TOKEN,
  });

  return webflowApiClient;
};

export const fetchTermsOfServices = async () => {
  const webflowApiClient = getWebflowApiClient();

  if (!SITE_ID || !COLLECTION_ID) {
    logError("Site ID or Collection ID not found");
    throw new HttpsError("internal", "Something went wrong!");
  }

  const termsOfServices = await webflowApiClient.collections.items.listItems(
    COLLECTION_ID,
    {
      limit: 1,
    }
  );

  return termsOfServices.items;
};
