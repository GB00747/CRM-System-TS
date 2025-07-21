import {Form, Input, Button, Typography, message,Modal} from "antd";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from '@/app/store'
import {useNavigate} from "react-router-dom";
import {signUp} from "@/features/auth/authThunks.ts";
import {validation} from "@/constants/validation.ts";

const {Link} = Typography;

interface RegistrationFormData {
  username: string;
  login: string;
  password: string;
  email: string;
  phoneNumber?: string;
}

export default function RegistrationPage() {

  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = async (values: RegistrationFormData & { confirm?: string }) => {

      const {confirm, ...rest} = values;
      const dataToSend = {
        ...rest,
        phoneNumber: rest.phoneNumber || ''
      }

      await dispatch(signUp(dataToSend))

        setIsModalVisible(true);
        message.success("Регистрация прошла успешно. Перейдите на страницу авторизации.");
  }

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/");
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[
            { required: true, message: "Введите имя" },
            {
              min: validation.username.min,
              max: validation.username.max,
              message: `От ${validation.username.min} до ${validation.username.max} символов`,
            },
            { pattern: validation.username.pattern, message: validation.username.message },
          ]}
        >
          <Input/>
        </Form.Item>

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
          <Input/>
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
            },
          ]}
          hasFeedback
        >
          <Input.Password/>
        </Form.Item>

        <Form.Item
          label="Повторите пароль"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password/>
        </Form.Item>


        <Form.Item
          label="Почтовый адрес"
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email" },
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phoneNumber"
          validateTrigger="onBlur"
          rules={[
            { pattern: validation.phone.pattern, message: validation.phone.message },
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Зарегистрироваться
          </Button>
        </Form.Item>

        <Form.Item className="text-center">
          Уже есть аккаунт? <Link onClick={() => navigate("/")}>Войти</Link>
        </Form.Item>
      </Form>

      <Modal
        title="Регистрация завершена"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Перейти к авторизации"
        cancelText="Остаться здесь"
      >
        <p>Нажмите “Перейти к авторизации”, чтобы войти в систему.</p>
      </Modal>
      </>
  );
}