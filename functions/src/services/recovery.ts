import { firestore } from "./firebaseAdmin";
import { RecoveryMethods } from "../types/recoveryMethods";

export const updateUserRecoveryMethod = async (
  uid: string,
  recoveryMethod: RecoveryMethods,
  value: string
): Promise<boolean> => {
  const userPrivateInfoRef = firestore
    .collection("users")
    .doc(uid)
    .collection("private")
    .doc("info");

  try {
    const recoveryData: Record<string, string> = {
      [recoveryMethod === RecoveryMethods.EMAIL
        ? "recoveryEmail"
        : "recoveryPhone"]: value,
    };

    const doc = await userPrivateInfoRef.get();

    if (doc.exists) {
      await userPrivateInfoRef.update(recoveryData);
    } else {
      await userPrivateInfoRef.set(recoveryData);
    }

    return true;
  } catch (error) {
    throw new Error("Failed to update recovery method");
  }
};

export const getUserRecoveryMethods = async (
  uid: string
): Promise<{ recoveryEmail: string | null; recoveryPhone: string | null }> => {
  const userPrivateInfoRef = firestore
    .collection("users")
    .doc(uid)
    .collection("private")
    .doc("info");

  try {
    const doc = await userPrivateInfoRef.get();
    if (doc.exists) {
      const data = doc.data();
      const recoveryEmail = data?.recoveryEmail || null;
      const recoveryPhone = data?.recoveryPhone || null;
      return { recoveryEmail, recoveryPhone };
    }
    return { recoveryEmail: null, recoveryPhone: null };
  } catch (error) {
    throw new Error("Error retrieving recovery methods");
  }
};

export const validateRecoveryMethod = async (
  uid: string,
  recoveryMethod: string,
  value: string
): Promise<boolean> => {
  const userPrivateInfoRef = firestore
    .collection("users")
    .doc(uid)
    .collection("private")
    .doc("info");

  try {
    const doc = await userPrivateInfoRef.get();
    if (doc.exists) {
      const data = doc.data();
      const recoveryKey =
        recoveryMethod === RecoveryMethods.EMAIL
          ? "recoveryEmail"
          : "recoveryPhone";
      if (data && data[recoveryKey] === value) {
        return true;
      }
    }
    return false;
  } catch (error) {
    throw new Error("Error verifying recovery method");
  }
};

export const getMaskedUserRecoveryMethods = async (
  uid: string
): Promise<{ recoveryEmail: string | null; recoveryPhone: string | null }> => {
  const { recoveryEmail, recoveryPhone } = await getUserRecoveryMethods(uid);

  let maskedRecoveryEmail,
    maskedRecoveryPhone = null;

  if (recoveryEmail) {
    const [localPart, domain] = recoveryEmail.split("@");
    const maskedLocal = `${localPart.slice(0, 3)}••••••`;
    maskedRecoveryEmail = `${maskedLocal}@${domain}`;
  }

  if (recoveryPhone) {
    maskedRecoveryPhone = `••• ••• ••${recoveryPhone.slice(-2)}`;
  }

  return {
    recoveryEmail: maskedRecoveryEmail || null,
    recoveryPhone: maskedRecoveryPhone || null,
  };
};
