import { onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { seedFirestore } from "../../services/emulatorSeeders";

export const emulatorSeeder = onCall(corsOptions, async () => {
  const data = await seedFirestore();
  return { data };
});
