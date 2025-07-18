import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import {signIn} from "@/features/auth/authThunks.ts";
import { AuthData } from "@/features/auth/authTypes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store.ts";
import {Validation} from "@/constants/validation.ts";

const { Link } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: AuthData) => {
    try {
      await dispatch(signIn(values)).unwrap();
      message.success("Авторизация прошла успешно.");
      navigate("/app/todos");
    } catch (error: any) {
        message.error(error);
      }
    }


  return (
      <div>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Логин"
            name="login"
            rules={[
              { required: true, message: "Введите логин" },
              {
                min: Validation.login.min,
                max: Validation.login.max,
                message: `От ${Validation.login.min} до ${Validation.login.max} символов`,
              },
              { pattern: Validation.login.pattern, message: Validation.login.message },
            ]}
          >
            <Input autoFocus/>
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: "Введите пароль" },
              {
                min: Validation.password.min,
                max: Validation.password.max,
                message: `От ${Validation.password.min} до ${Validation.password.max} символов`,
              },
              { pattern: Validation.password.pattern, message: Validation.password.message },
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
            Нет аккаунта?{' '}
            <Link onClick={() => navigate("/register")}>Зарегистрироваться</Link>
          </Form.Item>
        </Form>
      </div>
  );
}
