import axios from "axios";
import { tokenStorage } from "@/features/auth/services/tokenStorage.ts";
import { authApi } from "@/api/authApi.ts";

const axiosInstance = axios.create({
  baseURL: "https://easydev.club/api/v1"
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(config => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        tokenStorage.clearAccessToken();

        return Promise.reject(error);
      }

      try {
        const { accessToken, refreshToken: newRefreshToken } = await authApi.refreshTokens({ refreshToken });

        tokenStorage.setAccessToken(accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        tokenStorage.clear();
        // редирект на страницу логина, если нужно
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
