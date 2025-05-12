import { HttpsError, onCall } from "firebase-functions/v2/https";
import { corsOptions } from "../../config/corsOptions";
import { logError } from "../../services/logging";
import { format, eachMonthOfInterval, sub } from "date-fns";
import { firestore } from "../../services/firebaseAdmin";
import { Invoice } from "../../types/subscription";

interface MonthlyEarning {
  month: string;
  year: string;
  earnings: number;
}

export const getCreatorEarning = onCall(corsOptions, async (request) => {
  const creatorUid = request.auth?.uid;
  if (!creatorUid) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const invoicesRef = firestore.collection("invoices");

  try {
    const currentDate = new Date();
    const anchorPoint = sub(currentDate, { months: 11 });

    const invoicesSnapshot = await invoicesRef
      .where("creatorUid", "==", creatorUid)
      .where("createdAt", ">=", anchorPoint)
      .get();

    // Initialize months map
    const monthlyEarningsMap = new Map<string, MonthlyEarning>();
    eachMonthOfInterval({ start: anchorPoint, end: currentDate }).forEach(
      (date) => {
        const month = format(date, "MMM");
        const year = format(date, "yyyy");
        const key = `${month}-${year}`;
        monthlyEarningsMap.set(key, {
          month,
          year,
          earnings: 0,
        });
      }
    );

    // Single pass through invoices
    invoicesSnapshot.docs.forEach((doc) => {
      const invoice = doc.data() as Invoice;
      const date = invoice.createdAt.toDate();
      const key = `${format(date, "MMM")}-${format(date, "yyyy")}`;

      const monthData = monthlyEarningsMap.get(key);
      if (monthData) {
        monthData.earnings += invoice.amountPaid / 100;
      }
    });

    // Convert map to array and round earnings
    const monthlyEarnings = Array.from(monthlyEarningsMap.values()).map(
      (month) => ({
        ...month,
        earnings: Math.round(month.earnings),
      })
    );

    return monthlyEarnings;
  } catch (error) {
    logError(error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to fetch creator earnings.");
  }
});
