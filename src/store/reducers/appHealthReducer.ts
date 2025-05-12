import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosInstance } from "@/services/apiClient";
import { ServiceHealth } from "@/types";
import { HealthState } from '../types';

const axiosInstance = getAxiosInstance();

const initialState: HealthState = {
  status: 'idle',
  services: [],
  error: null
};

export const checkHealth = createAsyncThunk(
  'health/check',
  async () => {
    const {
      data: { servicesHealth },
    } = await axiosInstance.get<{
      servicesHealth: ServiceHealth[];
    }>("http-views-getServicesHealth");

    return servicesHealth;
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkHealth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkHealth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.services = [...action.payload];
      })
      .addCase(checkHealth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default healthSlice;