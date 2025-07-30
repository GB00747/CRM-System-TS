import { configureStore } from "@reduxjs/toolkit";
import TodosReducer from "@/features/todos/TodoSlice.ts";
import AuthReducer from "@/features/auth/authSlice.ts";
import UserReducer from "@/features/users/userSlice.ts"

export const store = configureStore({
  reducer: {
    todos: TodosReducer,
    auth: AuthReducer,
    user: UserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
