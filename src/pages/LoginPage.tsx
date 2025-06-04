import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "@/features/auth/authSlice.ts";
import { AuthData } from "@/features/auth/authTypes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store.ts";

const { Link } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: AuthData) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success("Авторизация прошла успешно.");
      navigate("/app/todos");
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error("Неверные логин или пароль");
      } else {
        message.error("Ошибка авторизации. Попробуйте позже.");
      }
    }
  };

  return (
      <div>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Логин"
            name="login"
            rules={[
              { required: true, message: "Введите логин" },
              { min: 2, max: 60, message: "От 2 до 60 символов" },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: "Только латинские буквы и цифры",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: "Введите пароль" },
              { min: 6, max: 60 },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>

          <Form.Item className="text-center">
            Нет аккаунта?{" "}
            <Link onClick={() => navigate("/register")}>Зарегистрироваться</Link>
          </Form.Item>
        </Form>
      </div>
  );
}
