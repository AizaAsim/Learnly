import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";
import { getStorage } from "firebase-admin/storage";

if (!getApps().length) {
  initializeApp();
}

export const firestore = getFirestore();
export const auth = getAuth();
export const messaging = getMessaging();
export const storage = getStorage();
export const app = getApp();
