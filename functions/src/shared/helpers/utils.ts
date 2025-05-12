import { Timestamp } from "firebase-admin/firestore";
import { NormalizedTimestamp } from "../../types";
import { firestore } from "../../services/firebaseAdmin";
import { logInfo } from "../../services/logging";

export const convertUnixToFirestoreTimestamp = (unixTimestamp: number) =>
  Timestamp.fromMillis(unixTimestamp * 1000);

export const normalizeToFirestoreTimestamp = (
  normalizedTimestamp: NormalizedTimestamp
) => {
  return new Timestamp(
    normalizedTimestamp._seconds,
    normalizedTimestamp._nanoseconds
  );
};

export const getEmail = async (userId: string) => {
  const userInfoRef = firestore
    .collection("users")
    .doc(userId)
    .collection("private")
    .doc("info");
  const userInfo = await userInfoRef.get();
  if (!userInfo.exists) {
    throw new Error(`Cannot retrieve email for user with id ${userId}.`);
  }
  const email = userInfo.data()?.email;
  return email;
};

export const getPhoneNumber = async (userId: string) => {
  // TODO: Implement this function
  logInfo("Getting phone number for user with id", userId);
  return "1234567890";
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const joinStringsWithCommaAndAnd = (strings: string[]) => {
  if (!strings.length) return "";
  if (strings.length === 1) return capitalize(strings[0]);

  const capitalizedArray = strings.map(capitalize);
  const lastElement = capitalizedArray.pop(); // Remove and store the last element
  return `${capitalizedArray.join(", ")} and ${lastElement}`;
};

export const omitProperties = <T extends object, K extends keyof T>(
  obj: T,
  keysToOmit: K[]
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.includes(key as K))
  ) as Omit<T, K>;
};
