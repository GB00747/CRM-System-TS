import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://easydev.club/api/v1"});


import {authApi} from "@/api/authApi.ts";
import {message} from "antd";


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

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        message.error("Сессия истекла. Пожалуйста, войдите снова.");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        delete axiosInstance.defaults.headers.common["Authorization"];

        window.location.href = "/";
        return Promise.reject("Refresh token not found");
      }

      try {
        const res = await authApi.refresh({ refreshToken });

        const newAccessToken = res.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        message.error("Ошибка при обновлении токена");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        delete axiosInstance.defaults.headers.common["Authorization"];

        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;