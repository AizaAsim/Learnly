import axios from "axios";
import { getAuth } from "firebase/auth";

export const getAxiosInstance = (isCdnBased?: boolean) => {
  const baseURL = isCdnBased
    ? import.meta.env.VITE_FUNCTIONS_CDN_BASE_URL
    : import.meta.env.VITE_FUNCTIONS_BASE_URL;
  const axiosInstance = axios.create({ baseURL });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
