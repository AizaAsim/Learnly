import { onRequest } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { AppError } from "../../shared/classes/AppError";
import {
  meiliSearchHealth,
  muxHealth,
  sendgridHealth,
  stripeHealth,
  twilioHealth,
} from "../../services/servicesHealth";

export const getServicesHealth = onRequest(corsOptions, async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const servicesHealth = await Promise.all([
      muxHealth(),
      meiliSearchHealth(),
      stripeHealth(),
      sendgridHealth(),
      twilioHealth(),
    ]);
    res.status(200).json({ servicesHealth });
  } catch (error) {
    logError(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
