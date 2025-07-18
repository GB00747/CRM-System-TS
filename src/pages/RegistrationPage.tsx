import {Form, Input, Button, Typography, message,Modal} from "antd";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from '@/app/store'
import {useNavigate} from "react-router-dom";
import {signUp} from "@/features/auth/authThunks.ts";
import {Validation} from "@/constants/validation.ts";

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
              min: Validation.username.min,
              max: Validation.username.max,
              message: `От ${Validation.username.min} до ${Validation.username.max} символов`,
            },
            { pattern: Validation.username.pattern, message: Validation.username.message },
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
              min: Validation.login.min,
              max: Validation.login.max,
              message: `От ${Validation.login.min} до ${Validation.login.max} символов`,
            },
            { pattern: Validation.login.pattern, message: Validation.login.message },
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
              min: Validation.password.min,
              max: Validation.password.max,
              message: `От ${Validation.password.min} до ${Validation.password.max} символов`,
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
            { pattern: Validation.phone.pattern, message: Validation.phone.message },
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