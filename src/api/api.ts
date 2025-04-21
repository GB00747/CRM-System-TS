import {
  Task,
  UpdateTask,
  FilteredTasksResponse,
  Filter,
} from "../types/todoTypes.ts";

const TODO_API = "https://easydev.club/api/v1/todos";

export const deleteTaskApi = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${TODO_API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }
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
    const response = await fetch(`${TODO_API}?filter=${filter}`);

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка запроса:", error.message);
    }
  }
};

export const addTaskApi = async (title: string): Promise<Task | undefined> => {
  try {
    const response = await fetch(TODO_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка запроса:", error.message);
    }
  }
};

export const updateTaskApi = async (
  id: number,
  data: UpdateTask,
): Promise<Task | undefined> => {
  try {
    const putResponse = await fetch(`${TODO_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!putResponse.ok) {
      throw new Error(`Ошибка при обновлении: ${putResponse.statusText}`);
    }

    return await putResponse.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка запроса:", error.message);
    }
  }
};
