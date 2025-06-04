import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Filter, Task, TaskInfo, FilteredTasksResponse} from './todoTypes'
import {todosApi} from "@/api/todosApi";

export interface TodosState {
  todos: Task[]
  info: TaskInfo
  meta: {
    totalAmount: number
  }
  error: string | null
}


const initialState: TodosState = {
  todos: [],
  info: {
    all: 0,
    completed: 0,
    inWork: 0
  },
  meta: {
    totalAmount: 0,
  },
  error: null,
};

export const fetchTodos = createAsyncThunk<
  FilteredTasksResponse,
  Filter,
  { rejectValue: string }
>(
  'todos/fetchTodos',
  async (
    filter,
    { rejectWithValue }
  ) => {
    try {
      const data = await todosApi.filteredTasks(filter);
      return data;
    } catch (error: unknown) {
      // Обязательно return!
      return rejectWithValue("Ошибка при загрузке задач");
    }
  }
);


export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: number, thunkAPI) => {
    try {
      await todosApi.deleteTask(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Ошибка при удалении задачи");
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (
    {id, data}: { id: number; data: { title?: string; isDone?: boolean } },
    thunkAPI
  ) => {
    try {
      const updatedTask = await todosApi.updateTask(id, data);

      return updatedTask;
    } catch (error) {
      return thunkAPI.rejectWithValue("Ошибка при обновлении задачи");
    }
  }
);


const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload.data;
        state.info = action.payload.info;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default todosSlice.reducer