import { Typography } from "antd";

export function ProfilePage() {
  const { Title } = Typography;

  return (
    <Title
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Hello!
    </Title>
  );
}
