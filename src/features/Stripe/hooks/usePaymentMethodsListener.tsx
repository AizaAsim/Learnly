import { firestore } from "@/services/firebase";
import { AppDispatch } from "@/store";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { PaymentMethod } from "../types";
import { updatePaymentMethods } from "@/store/reducers/paymentMethodsReducer";

export const usePaymentMethodsListener = (userId: string | undefined) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(firestore, `stripe_users/${userId}/payment_methods`),
      orderBy("isActive", "desc"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentMethods = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PaymentMethod[];

      dispatch(updatePaymentMethods(paymentMethods));
    });

    return () => unsubscribe();
  }, [userId, dispatch]);
};
