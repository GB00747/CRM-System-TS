import axiosInstance from "@/api/axiosInstance.ts";

import {
  Task,
  UpdateTask,
  FilteredTasksResponse,
  Filter,
} from "@/features/todos/todoTypes.ts";


export const todosApi = {
  async deleteTask(id: number): Promise<void> {
    await axiosInstance.delete(`/todos/${id}`);
    console.log('Задача удалена успешно')
  },

  async filteredTasks(
    filter: Filter,
  ): Promise<FilteredTasksResponse> {
    const response = await axiosInstance.get<FilteredTasksResponse>("/todos", {
      params: {filter},
    })
    console.log(`Задачи по фильтру ${filter} получены`, response.data)
    return response.data;
  },

  async addTask(title: string): Promise<Task> {
    const response = await axiosInstance.post<Task>("/todos", {title});
    console.log('Задача добавлена', response.data)
    return response.data;
  },

  async updateTask(
    id: number,
    data: UpdateTask,
  ): Promise<Task> {
    const response = await axiosInstance.put<Task>(`/todos/${id}`, data);
    console.log('Задача обновлена', response.data)
    return response.data;
  },
};
