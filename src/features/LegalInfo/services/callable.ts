import { functions } from "@/services/firebase";
import { httpsCallable } from "firebase/functions";

export const checkUserAgreed = httpsCallable<void, boolean>(
  functions,
  "terms-getAgreement"
);

export const saveUserAgreement = httpsCallable<void, boolean>(
  functions,
  "terms-saveAgreement"
);
