import { Timestamp } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v2/https";
import { UserRootType, UserType } from "../shared/schemas/users";
import { CreatorLogType } from "../types/creatorLogging";
import { Roles } from "../types/roles";
import { logCreatorEvent } from "./creatorLogging";
import { auth, firestore } from "./firebaseAdmin";

export const getUser = async (id: string, skipDeleted = false) => {
  const userRef = firestore.collection("users").doc(id);
  const userDoc = await userRef.get();

  // Early return if the document doesn't exist or is deleted
  const userData = userDoc.data();
  if (!userDoc.exists || (skipDeleted && userData?.deletedAt)) {
    return null;
  }

  // Fetch private info
  const userPrivateRef = userRef.collection("private").doc("info");
  const userPrivateDoc = await userPrivateRef.get();

  // Combine public and private data
  return {
    ...userData,
    ...userPrivateDoc.data(),
  } as UserType;
};

export const getUserByUsername = async (username: string) => {
  const userSnapshot = await firestore
    .collection("users")
    .where("username", "==", username)
    .get();
  if (userSnapshot.empty) {
    return null;
  }
  const userData = userSnapshot.docs[0].data() as UserRootType;
  return userData;
};

export const updateUserData = async (id: string, data: Partial<UserType>) => {
  // validate email, display name, and username
  if (data.email && !(await validateUserEmail(id, data.email))) {
    throw new HttpsError("already-exists", "Email already in use", {
      field: "email",
    });
  }
  if (
    data.displayName &&
    !(await validateUserDisplayName(id, data.displayName))
  ) {
    throw new HttpsError("already-exists", "Display name already in use", {
      field: "displayName",
    });
  }
  if (data.username && !(await validateUserUsername(id, data.username))) {
    throw new HttpsError("already-exists", "Username already in use", {
      field: "username",
    });
  }

  // Remove email from data
  delete data.email;

  // update user data
  await firestore.collection("users").doc(id).update(data);
  return getUser(id);
};

export const validateUserEmail = async (id: string, email: string) => {
  const userDoc = await firestore
    .collection("users")
    .where("email", "==", email)
    .get();
  return userDoc.docs.length === 0 || userDoc.docs[0].id === id;
};

export const validateUserDisplayName = async (
  id: string,
  displayName: string
) => {
  const userDoc = await firestore
    .collection("users")
    .where("displayName", "==", displayName)
    .get();
  return userDoc.docs.length === 0 || userDoc.docs[0].id === id;
};

export const validateUserUsername = async (id: string, username: string) => {
  const userDoc = await firestore
    .collection("users")
    .where("username", "==", username)
    .get();
  return userDoc.docs.length === 0 || userDoc.docs[0].id === id;
};

export const blockUser = async (creatorId: string, userId: string) => {
  const blockRef = firestore
    .collection("blocked_users")
    .doc(`${creatorId}_${userId}`);
  const eventsRef = blockRef.collection("events").doc();

  await blockRef.set(
    {
      creatorId,
      userId,
      blocked: true,
      timestamp: Timestamp.now(),
    },
    { merge: true }
  );

  await eventsRef.set({
    type: CreatorLogType.BLOCK_USER,
    timestamp: Timestamp.now(),
  });
};

export const isUserBlocked = async (
  creatorId: string,
  userId: string
): Promise<boolean> => {
  const blockRef = firestore
    .collection("blocked_users")
    .doc(`${creatorId}_${userId}`);
  const blockDoc = await blockRef.get();
  const blockData = blockDoc.data();
  return blockDoc.exists && blockData?.blocked;
};

export const unblockUser = async (creatorId: string, userId: string) => {
  const blockRef = firestore
    .collection("blocked_users")
    .doc(`${creatorId}_${userId}`);
  const eventsRef = blockRef.collection("events").doc();

  await blockRef.update({
    blocked: false,
    timestamp: Timestamp.now(),
  });

  await eventsRef.set({
    type: CreatorLogType.UNBLOCK_USER,
    timestamp: Timestamp.now(),
  });

  await logCreatorEvent({
    type: CreatorLogType.UNBLOCK_USER,
    creatorId,
    data: { userId },
  });

  return { blocked: false };
};

export const getUserRole = async (uid: string) => {
  const userRecord = await auth.getUser(uid);
  return userRecord.customClaims?.role as Roles;
};

export const getUserByEmail = async (email: string) => {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return { id: userRecord.uid } as UserType;
  } catch (error) {
    return null;
  }
};

export const updateUserEmail = async (uid: string, email: string) => {
  if (email && !(await validateUserEmail(uid, email))) {
    throw new HttpsError("already-exists", "Email already in use", {
      field: "email",
    });
  }
  try {
    await auth.updateUser(uid, { email });
    await firestore
      .collection("users")
      .doc(uid)
      .collection("private")
      .doc("info")
      .update({ email });
  } catch (error) {
    throw new HttpsError("internal", "Failed to update email");
  }
};
