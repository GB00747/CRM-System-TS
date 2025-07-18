import axios from "axios";
import {tokenStorage} from "@/features/auth/services/tokenStorage.ts";

const axiosInstance = axios.create(
  {
    baseURL: "https://easydev.club/api/v1"
  });


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        return Promise.reject(error)
      }

      try {
        const refreshResponse = await axios.post(`https://easydev.club/api/v1/auth/refresh`, {refreshToken})
        const {
          accessToken,
          refreshToken: newRefreshToken
        } = refreshResponse.data


        tokenStorage.setAccessToken(accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        console.log('Токены обновлены внутри интесептора')
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('Ошибка при обновлении токена:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance;