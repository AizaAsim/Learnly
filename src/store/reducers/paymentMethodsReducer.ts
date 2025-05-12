import { PaymentMethod } from "@/features/Stripe/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import rootReducer from "..";
import { PaymentMethodsState } from "../types";

const initialState: PaymentMethodsState = {
  items: [],
  loading: true,
  error: null,
  pendingAdditions: [],
  pendingDeletions: [], // Add to initial state
};

const paymentMethodsSlice = createSlice({
  name: "paymentMethods",
  initialState,
  reducers: {
    addOptimisticPaymentMethod: (state, action: PayloadAction<string>) => {
      state.pendingAdditions.push(action.payload);
    },
    removePendingAddition: (state, action: PayloadAction<string>) => {
      state.pendingAdditions = state.pendingAdditions.filter(
        (id) => id !== action.payload
      );
    },
    startDeletingPaymentMethod: (state, action: PayloadAction<string>) => {
      state.pendingDeletions.push(action.payload);
    },
    finishDeletingPaymentMethod: (state, action: PayloadAction<string>) => {
      state.pendingDeletions = state.pendingDeletions.filter(
        (id) => id !== action.payload
      );
    },
    updatePaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      const newPaymentMethods = action.payload;

      // If we have pending additions and received new payment methods,
      // remove the oldest pending addition (FIFO)
      if (
        state.pendingAdditions.length > 0 &&
        newPaymentMethods.length > state.items.length
      ) {
        state.pendingAdditions.shift(); // Remove the oldest pending addition
      }
      // Keep track of deleted cards
      if (newPaymentMethods.length < state.items.length) {
        const deletedCard = state.items.find(
          (item) => !newPaymentMethods.find((newItem) => newItem.id === item.id)
        );
        if (deletedCard) {
          state.pendingDeletions = state.pendingDeletions.filter(
            (id) => id !== deletedCard.id
          );
        }
      }
      state.loading = false;
      state.items = newPaymentMethods;
    },
  },
});

export const {
  addOptimisticPaymentMethod,
  removePendingAddition,
  updatePaymentMethods,
  startDeletingPaymentMethod,
  finishDeletingPaymentMethod,
} = paymentMethodsSlice.actions;

export default paymentMethodsSlice.reducer;

export const withPaymentMethodSlice = rootReducer.inject(paymentMethodsSlice);
