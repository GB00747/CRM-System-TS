import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegistrationPage.tsx";
import TodoListPage from "../pages/TodoListPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import AuthLayout from "../layout/AuthLayout";
import LayoutWithMenu from "../layout/LayoutWithMenu";
import PrivateRoute from "@/pages/PrivateRoute.tsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthLayout title="Вход в систему">
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthLayout title="Регистрация">
        <RegisterPage />
      </AuthLayout>
    ),
  },
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <LayoutWithMenu />
      </PrivateRoute>
    ),
    children: [
      { path: "todos", element: <TodoListPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
