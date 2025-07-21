import { Typography } from "antd";
import { useSelector} from "react-redux";
import { RootState} from "@/app/store";

const { Title, Text } = Typography;

export default function ProfilePage() {

  const user = useSelector<RootState>((state) => state.auth.profile);

  return (
    <div className="max-w-md mx-auto p-4 mt-10 shadow-lg rounded-xl">
      <Title level={2}>Личный кабинет</Title>

      <div style={{marginBottom: 16}}>
        <Text strong>Имя пользователя:</Text> <Text>{user.username}</Text>
      </div>

      <div style={{marginBottom: 16}}>
        <Text strong>Почтовый адрес:</Text> <Text>{user.email}</Text>
      </div>

      <div style={{marginBottom: 16}}>
        <Text strong>Телефон:</Text> <Text>{user.phoneNumber || "-"}</Text>
      </div>
    </div>
  );
}