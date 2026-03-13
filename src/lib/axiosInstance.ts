import axios from "axios";
import { API_ROUTES } from "../constants/api.routes";
import { env } from "../constants/env";

const axiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true, // Send cookies (access_token, refresh_token) with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if a token refresh is already in progress to avoid parallel refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401 errors and if we haven't already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => axiosInstance(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axios.post(
        `${env.VITE_API_BASE_URL}${API_ROUTES.REFRESH_TOKEN}`,
        {},
        { withCredentials: true },
      );

      processQueue(null);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
