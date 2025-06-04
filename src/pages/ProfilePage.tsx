import {useEffect} from "react";
import { Typography } from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/app/store";
import {getProfile} from "@/features/auth/authSlice";
import { UserResponse } from "@/features/auth/authTypes";

const { Title, Text } = Typography;



export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector<RootState, UserResponse | null>((state) => state.auth.user);


  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (!user) {
    return <div>Данные профиля не найдены</div>;
  }

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