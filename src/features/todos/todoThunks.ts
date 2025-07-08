import {createAsyncThunk} from "@reduxjs/toolkit";
import {Filter, FilteredTasksResponse} from "@/features/todos/todoTypes.ts";
import {todosApi} from "@/api/todosApi.ts";

export const fetchTodos = createAsyncThunk<
  FilteredTasksResponse,
  Filter,
  { rejectValue: string }
>(
  'todos/fetchTodos',
  async (
    filter,
    {rejectWithValue}
  ) => {
    try {
      return await todosApi.filteredTasks(filter);
    } catch (error) {
      console.log(error)
      if (!error.response) {
        return rejectWithValue('Проверьте соединение с интернетом')
      }
      const status = error.response.status

      switch (status) {
        case 500:
          return rejectWithValue("Внутренняя ошибка сервера.");
        default:
          return rejectWithValue("Произошла неизвестная ошибка при загрузке задач");
      }

    }
  }
);

export const addTask = createAsyncThunk(
  'todos/addTask',
  async (title, {rejectWithValue}) => {
    try {
      return await todosApi.addTask(title)
    } catch (error) {
      console.log(error)
      if (!error.response) {
        return rejectWithValue('Проверьте соединение с интернетом')
      }
      const status = error.response.status

      switch (status) {
        case 400:
          return rejectWithValue("Неверное тело запроса или отсутствуют/неверные поля.");
        case 500:
          return rejectWithValue("Внутренняя ошибка сервера.");
        default:
          return rejectWithValue("Произошла неизвестная ошибка при добавлении задачи");
      }

    }
  }
)


export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: number, {rejectWithValue}) => {
    try {
      await todosApi.deleteTask(id);
      return id;
    } catch (error) {
      console.log(error)
      if (!error.response) {
        return rejectWithValue('Проверьте соединение с интернетом')
      }
      const status = error?.response?.status;

      switch (status) {
        case 400:
          return rejectWithValue("Неверный или отсутствующий ID пользователя.");
        case 401:
          return rejectWithValue("Неавторизованный доступ. Токен отсутствует или недействителен.");
        case 403:
          return rejectWithValue("Недостаточно прав доступа.");
        case 404:
          return rejectWithValue("Пользователь не найден.");
        case 500:
          return rejectWithValue("Внутренняя ошибка сервера.");
        default:
          return rejectWithValue("Произошла неизвестная ошибка при удалении задачи");
      }
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (
    {id, data}: { id: number; data: { title?: string; isDone?: boolean } },
    {rejectWithValue}
  ) => {
    try {
      return await todosApi.updateTask(id, data);

    } catch (error) {
      if (!error.response) {
        return rejectWithValue('Проверьте соединение с интернетом')
      }
      const status = error.response.status
      switch (status) {
        case 400:
          return rejectWithValue("Неверное тело запроса или отсутствуют/неверны поля.");
        case 404:
          return rejectWithValue("Задача не найдена.");
        case 500:
          return rejectWithValue("Внутренняя ошибка сервера.");
        default:
          return rejectWithValue("Произошла неизвестная ошибка при обновлении задачи");
      }
    }
  }
);