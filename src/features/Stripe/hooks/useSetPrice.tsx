import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { firestore } from "@/services/firebase";
import { logError } from "@/services/logging";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const useSetPrice = (onSuccess?: () => void) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "activateSubscription.setPrice",
  });
  const [creatorSubscriptionDocId, setCreatorSubscriptionDocId] = useState<
    string | null
  >(null);
  const { user } = useAuth();
  const creatorSubscriptionCol = collection(
    firestore,
    "creators_subscriptions"
  );

  const priceSchema = z.object({
    price: z.preprocess(
      (val) => parseFloat(val as string),
      z
        .number({
          required_error: t("input_errors.required"),
          invalid_type_error: t("input_errors.required"),
        })
        .min(
          4.99,
          t("input_errors.min", {
            price: 4.99,
          })
        )
        .max(
          49.99,
          t("input_errors.max", {
            price: 49.99,
          })
        )
        .refine(
          (val) => {
            if (val % 1 === 0) return true;
            const strVal = val.toString();
            return /^\d+(\.99)?$/.test(strVal);
          },
          {
            message: t("input_errors.unallowed_decimals"),
          }
        )
    ),
  });

  type FormData = z.infer<typeof priceSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(priceSchema),
    defaultValues: async () => {
      if (!user) {
        return { price: "" };
      }
      const q = query(
        creatorSubscriptionCol,
        where("creatorUid", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const subscriptionData = querySnapshot.docs[0].data();
        const price = subscriptionData.subscriptionPrice;
        setCreatorSubscriptionDocId(querySnapshot.docs[0].id);
        return { price };
      }
      return { price: "" };
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (!user) return;
      if (creatorSubscriptionDocId) {
        // Update the price
        const docRef = doc(creatorSubscriptionCol, creatorSubscriptionDocId);
        await updateDoc(docRef, { subscriptionPrice: data.price });
      } else {
        // Create a new subscription price
        await addDoc(creatorSubscriptionCol, {
          creatorUid: user.uid,
          subscriptionPrice: data.price,
        });
      }
      // Change default values to the new price
      reset({ price: data.price });
      if (onSuccess) onSuccess();
    } catch (error) {
      logError(error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    price: watch("price"),
    isModified: isDirty,
  };
};
