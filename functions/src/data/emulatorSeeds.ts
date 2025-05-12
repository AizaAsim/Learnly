import { Timestamp } from "firebase-admin/firestore";

// Firestore data that is required to be seeded in the emulator for the app to function properly
export const emulatorSeeds = {
  // Collection Name
  termsOfService: [
    // Document 1
    {
      id: "seeded_tos",
      version: 0,
      html: "<h1>Terms of Service</h1>",
      publishedAt: Timestamp.now(),
    },
  ],
};
