import {configureStore} from "@reduxjs/toolkit";
import TodosReducer from '../features/todos/TodoSlice.js'
import AuthReducer from '@/features/auth/authSlice.ts'
import { setupInterceptors } from "@/api/setupAxiosInterceptors"
import axiosInstance from "@/api/axiosInstance.ts";

export const store = configureStore({
  reducer: {
    todos: TodosReducer,
    auth: AuthReducer,
  },
})

setupInterceptors(axiosInstance, store.dispatch);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch