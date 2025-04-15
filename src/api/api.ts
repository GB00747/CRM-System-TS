import { Task, FilteredTasksResponse, Filter } from "./api.types.ts";

const TODO_API = "https://easydev.club/api/v1/todos";



export const deleteTaskApi = async (id: number): Promise<null> => {
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

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при удалении задачи:", error.message);
    }
    return null;
  }
};


export const filteredTasksApi = async (
  filter: Filter,
): Promise<FilteredTasksResponse | null> => {
  try {
    const response = await fetch(`${TODO_API}?filter=${filter}`);

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    return (await response.json()) as FilteredTasksResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка запроса:", error.message);
    }
    return null;
  }
};


export const addTaskApi = async (title: string): Promise<Task | null> => {
  try {
    const response = await fetch(TODO_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.statusText}`);
    }

    return (await response.json()) as Task;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка запроса:", error.message);
    }
    return null;
  }
};


export const updateTaskStatusApi = async (id: number): Promise<Task | null> => {
  try {
    const getResponse = await fetch(`${TODO_API}/${id}`);
    if (!getResponse.ok) {
      throw new Error(`Ошибка при получении задачи: ${getResponse.statusText}`);
    }

    const task: Task = await getResponse.json();
    const isDone: Task['isDone'] = task.isDone;

    const putResponse = await fetch(`${TODO_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDone: !isDone }),
    });

    if (!putResponse.ok) {
      throw new Error(`Ошибка при обновлении: ${putResponse.statusText}`);
    }

    return (await putResponse.json()) as Task;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка запроса:", error.message);
    }
    return null;
  }
};


export const updateTaskTitleApi = async (
  id: number,
  title: string,
): Promise<Task | null> => {
  try {
    const response = await fetch(`${TODO_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка изменения задачи: ${response.statusText}`);
    }

    return (await response.json()) as Task;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка запроса:", error.message);
    }
    return null;
  }
};
