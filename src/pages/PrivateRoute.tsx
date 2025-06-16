import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: any) {
  const [tokenExists, setTokenExists] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    const checkToken = () => {
      setTokenExists(!!localStorage.getItem("accessToken"));
    };

    const interval = setInterval(checkToken, 1000); // Проверка каждые 1 сек
    return () => clearInterval(interval);
  }, []);

  if (!tokenExists) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
