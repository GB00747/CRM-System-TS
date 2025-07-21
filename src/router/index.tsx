import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegistrationPage.tsx";
import TodoListPage from "../pages/TodoListPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import AuthLayout from "../layout/AuthLayout";
import PrivateLayout from "@/layout/PrivateLayout.tsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout/>,
    children: [
      {
        index: true,
        element: <LoginPage/>
      },
      {
        path: 'register',
        element: <RegisterPage />
      }
    ]
  },
  {
    path: "/app",
    element: <PrivateLayout/>,
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
