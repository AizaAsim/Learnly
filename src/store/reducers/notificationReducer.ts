import { createSlice } from "@reduxjs/toolkit";
import rootReducer from "..";
import { NotificationState } from "../types";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    status: "idle",
    error: null,
  } as NotificationState,
  reducers: {
    addNotification(state, action) {
      const index = state.notifications.findIndex(
        (notifications) => notifications.id === action.payload.id
      );
      // If the notification already exists, update it
      if (index !== -1) {
        state.notifications[index] = action.payload;
        return;
      }
      state.notifications.push(action.payload);
    },
    editNotification(state, action) {
      const index = state.notifications.findIndex(
        (notifications) => notifications.id === action.payload.id
      );
      if (index !== -1)
        Object.assign(state.notifications[index], action.payload);
    },
    removeNotification(state, action) {
      const index = state.notifications.findIndex(
        (notifications) => notifications.id === action.payload.id
      );
      state.notifications.splice(index, 1);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const {
  addNotification,
  editNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

export const withNotificationsSlice = rootReducer.inject(notificationSlice);
