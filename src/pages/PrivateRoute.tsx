import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: any) {
  // const [tokenExists, setTokenExists] = useState(!!localStorage.getItem("accessToken"));
  //
  // useEffect(() => {
  //   const checkToken = () => {
  //     setTokenExists(!!localStorage.getItem("accessToken"));
  //   };
  //
  //   const interval = setInterval(checkToken, 7000);
  //   return () => clearInterval(interval);
  // }, []);
  //
  // if (!tokenExists) {
  //
  //   localStorage.removeItem("refreshToken");
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
}
