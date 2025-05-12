import { functions } from "@/services/firebase";
import { httpsCallable } from "firebase/functions";
import { MonthlyEarning } from "../types";

export const getCreatorEarningsData = httpsCallable<void, MonthlyEarning[]>(
  functions,
  "views-getCreatorEarning"
);
