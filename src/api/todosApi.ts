import axiosInstance from "@/api/axiosInstance.ts";

import {
  Task,
  UpdateTask,
  FilteredTasksResponse,
  Filter,
} from "../features/todos/todoTypes.ts";




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
