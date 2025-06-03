import { AxiosInstance } from "axios";
import { AppDispatch } from "@/app/store";
import { setAccessToken, logout } from "@/features/auth/authSlice";
import { authApi } from "./authApi";

export function setupInterceptors(axiosInstance: AxiosInstance, dispatch: AppDispatch) {
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          const tokens = await authApi.refresh({ refreshToken });
          localStorage.setItem("accessToken", tokens.accessToken);
          dispatch(setAccessToken(tokens.accessToken));

          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          dispatch(logout());
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
}
