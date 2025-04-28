import axios from "axios";
import {
  Task,
  UpdateTask,
  FilteredTasksResponse,
  Filter,
} from "../types/todoTypes.ts";

const axiosInstance = axios.create({
  baseURL: "https://easydev.club/api/v1/todos",
  headers: {
    "Content-Type": "application/json",
  },
});

export const deleteTaskApi = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при удалении задачи:", error.message);
    }
  }
};

export const filteredTasksApi = async (
  filter: Filter,
): Promise<FilteredTasksResponse | undefined> => {
  try {
    const response = await axiosInstance.get<FilteredTasksResponse>("", {
      params: { filter },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при загрузке задач:", error.message);
    }
  }
};

export const addTaskApi = async (title: string): Promise<Task | undefined> => {
  try {
    const response = await axiosInstance.post<Task>("", { title });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при добавлении задачи:", error.message);
    }
  }
};

export const updateTaskApi = async (
  id: number,
  data: UpdateTask,
): Promise<Task | undefined> => {
  try {
    const response = await axiosInstance.put<Task>(`/${id}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при обновлении задачи:", error.message);
    }
  }
};
