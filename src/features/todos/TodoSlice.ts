import {createSlice} from "@reduxjs/toolkit";
import {Task, MetaResponse,TaskInfo} from './todoTypes'
import {
  fetchTodos,
  updateTodo,
  deleteTodo,
  addTask
} from "@/features/todos/todoThunks.ts";

export interface TodosState extends MetaResponse<Task, TaskInfo> {
  error: string | null;
}


const initialState: TodosState = {
  data: [],
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
        state.data = action.payload.data;
        state.info = action.payload.info;
        state.meta = action.payload.meta;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addTask.pending, (state) => {
        state.error = null
      })
      .addCase(addTask.fulfilled, (state) => {
        state.error = null
      })
      .addCase(addTask.rejected, (state,action) => {
        state.error = action.payload
      })
      .addCase(deleteTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default todosSlice.reducer