import { ReactNode } from "react";
import "./auth.css";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        {children}
      </div>
    </div>
  );
}
