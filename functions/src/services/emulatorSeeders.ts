import { emulatorSeeds } from "../data/emulatorSeeds";
import { isFirebaseEmulator } from "../shared/helpers/functionsMetadata";
import { firestore } from "./firebaseAdmin";
import { logInfo } from "./logging";

export const seedFirestore = async () => {
  let text = "";
  if (!isFirebaseEmulator) {
    text =
      "Firestore emulator seeding is only available in the emulator environment.";
    logInfo(text);
    return text;
  }

  logInfo("Starting Firestore emulator seeding...");

  if (await hasBeenSeeded()) {
    text = "Firestore emulator has already been seeded.";
    logInfo(text);
    return text;
  }

  await seed();

  text = "Firestore emulator seeded successfully.";
  logInfo(text);
  return text;
};

const hasBeenSeeded = async () => {
  // This is a terrible way to check if the emulator has been seeded, but it works for now.
  // TODO: Replace with less trash way.
  const tosCollectionExists = await firestore
    .collection("termsOfService")
    .get();
  return !tosCollectionExists.empty;
};

// Loop through the emulatorSeeds object and add each document to the Firestore emulator.
const seed = async () => {
  const seedCollections = Object.entries(emulatorSeeds);

  const promises = [];
  for (const [collectionName, documents] of seedCollections) {
    for (const document of documents) {
      promises.push(
        firestore.collection(collectionName).doc(document.id).set(document)
      );
    }
  }

  await Promise.all(promises);
};
