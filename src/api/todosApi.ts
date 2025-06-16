import axiosInstance from "@/api/axiosInstance.ts";

import {
  Task,
  UpdateTask,
  FilteredTasksResponse,
  Filter,
} from "../features/todos/todoTypes.ts";


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



export const todosApi = {
  deleteTask: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/todos/${id}`);
  },

  filteredTasks: async (
    filter: Filter,
  ): Promise<FilteredTasksResponse> => {
    const response = await axiosInstance.get<FilteredTasksResponse>("/todos", {
      params: { filter },
    });
    return response.data;
  },

  addTask: async (title: string): Promise<Task | undefined> => {
    const response = await axiosInstance.post<Task>("/todos", { title });
    return response.data;
  },

  updateTask: async (
    id: number,
    data: UpdateTask,
  ): Promise<Task> => {
    const response = await axiosInstance.put<Task>(`/todos/${id}`, data);
    return response.data;
  },
};
