import { isFirebaseEmulator } from "../../shared/helpers/functionsMetadata";
import { emulatorSeeder } from "./emulatorSeeder";

export const seeders = {
  ...(isFirebaseEmulator && { emulatorSeeder }),
};
