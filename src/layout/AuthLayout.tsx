import "./auth.css";
import {Outlet} from "react-router-dom";



export default function AuthLayout() {
  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <Outlet/>
      </div>
    </div>
  );
}
