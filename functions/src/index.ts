import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export { triggers } from "./triggers";
export * from "./callable";
export * from "./pubsub-triggers";
export * from "./webhooks";
export * from "./http";
