import { createSelector } from "@reduxjs/toolkit";
import { withPaymentMethodSlice } from "../reducers/paymentMethodsReducer";

const selectPaymentMethodsState = withPaymentMethodSlice.selector((state) => state.paymentMethods);

export const selectPaymentMethods = createSelector(
  selectPaymentMethodsState,
  (state) => state.items
);

export const selectPaymentMethodsLoading = createSelector(
  selectPaymentMethodsState,
  (state) => state.loading
);

export const selectPaymentMethodsError = createSelector(
  selectPaymentMethodsState,
  (state) => state.error
);

export const selectPendingAdditions = createSelector(
  selectPaymentMethodsState,
  (state) => state.pendingAdditions
);

export const selectPendingDeletions = createSelector(
  selectPaymentMethodsState,
  (state) => state.pendingDeletions
);