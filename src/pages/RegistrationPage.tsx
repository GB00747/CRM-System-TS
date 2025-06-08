import {Form, Input, Button, Typography, message,Modal} from "antd";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from '@/app/store'
import {useNavigate} from "react-router-dom";
import {register} from "@/features/auth/authSlice";
import AuthLayout from "../layout/AuthLayout";

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
    try {
      const {confirm, ...rest} = values;
      const dataToSend = {
        ...rest,
        phoneNumber: rest.phoneNumber || ''
      }

      console.log(dataToSend)

      await dispatch(register(dataToSend)).unwrap()

        setIsModalVisible(true);
        message.success("Регистрация прошла успешно. Перейдите на страницу авторизации.");

    } catch (error: any) {
      message.error(error);
    }
  }

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/");
  };

  return (
    <AuthLayout title='Регистрация'>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[
            {required: true, message: "Введите имя"},
            {min: 1, max: 60, message: "От 1 до 60 символов"},
            {pattern: /^[a-zA-Zа-яА-ЯёЁ\s-]+$/, message: "Только буквы русского или латинского алфавита"}
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Логин"
          name="login"
          rules={[
            {required: true, message: "Введите логин"},
            {min: 2, max: 60, message: "От 2 до 60 символов"},
            {pattern: /^[a-zA-Z]+$/, message: "Только латинские буквы"},
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{required: true, message: "Введите пароль"}, {min: 6, max: 60}]}
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
            {required: true, message: "Подтвердите пароль"},
            ({getFieldValue}) => ({
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
          rules={[{required: true, message: "Введите email"}, {type: "email"}]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phoneNumber"
          validateTrigger="onBlur"
          rules={[
            {
              pattern: /^\+[0-9]{10,15}$/,
              message: "Введите корректный номер телефона, начиная с +",
            },
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

    </AuthLayout>
  );
}