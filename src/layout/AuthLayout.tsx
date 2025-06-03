import { ReactNode } from "react";
import { Typography } from "antd";

const { Title } = Typography;

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-xl">
        <Title level={2} className="text-center mb-6">
          {title}
        </Title>
        {children}
      </div>
    </div>
  );
}
