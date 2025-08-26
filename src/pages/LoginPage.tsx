import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import {signIn} from "@/features/auth/authThunks.ts";
import { AuthData } from "@/features/auth/authTypes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store.ts";
import {validation} from "@/constants/validation.ts";

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
                min: validation.login.min,
                max: validation.login.max,
                message: `От ${validation.login.min} до ${validation.login.max} символов`,
              },
              { pattern: validation.login.pattern, message: validation.login.message },
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
                min: validation.password.min,
                max: validation.password.max,
                message: `От ${validation.password.min} до ${validation.password.max} символов`,
              }
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


/* для релиза */