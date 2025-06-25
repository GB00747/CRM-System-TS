import { configureStore } from "@reduxjs/toolkit";
import TodosReducer from "../features/todos/TodoSlice.ts";
import AuthReducer from "@/features/auth/authSlice.ts";

export const store = configureStore({
  reducer: {
    todos: TodosReducer,
    auth: AuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
