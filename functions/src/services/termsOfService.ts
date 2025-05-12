import { firestore } from "./firebaseAdmin";
import { DocumentReference, Timestamp } from "firebase-admin/firestore";

const getLatestTOS = async () => {
  const q = await firestore
    .collection("termsOfService")
    .orderBy("publishedAt", "desc")
    .limit(1)
    .get();
  return q.docs.length ? q.docs[0] : null;
};

const getUserAgreement = async (
  userIdDocRef: DocumentReference,
  termIdDocRef: DocumentReference
) => {
  const q = await firestore
    .collection("userAgreements")
    .where("userRef", "==", userIdDocRef)
    .where("termsRef", "==", termIdDocRef)
    .limit(1)
    .get();
  return q.docs.length;
};

export const checkUserAgreedToLatestTos = async (userId: string) => {
  const latestTerm = await getLatestTOS();
  if (!latestTerm) {
    return false;
  }
  const userDocRef = firestore.doc(`users/${userId}`);
  const termDocRef = firestore.doc(`termsOfService/${latestTerm.id}`);
  const userAgreement = await getUserAgreement(userDocRef, termDocRef);
  return userAgreement;
};

export const saveUserLatestAgreement = async (userId: string) => {
  try {
    const latestTerm = await getLatestTOS();
    if (!latestTerm) {
      return false;
    }
    const now = Timestamp.now();
    const docRef = firestore.collection("userAgreements").doc();
    await docRef.set({
      id: docRef.id,
      userRef: firestore.doc(`users/${userId}`),
      termsRef: firestore.doc(`termsOfService/${latestTerm.id}`),
      acceptedAt: now,
    });
    return true; // Return true if the agreement was successfully saved
  } catch (error) {
    return false; // Return false if there was an error saving the agreement
  }
};
