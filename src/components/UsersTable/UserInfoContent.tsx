import {MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {Typography, Space, Form, Input} from "antd";
import {validation} from "@/constants/validation.ts";

const {Text} = Typography;

const UserInfoContent = ({isEditing, form, user}) => {
  if (!user) return null;

  if (!isEditing) {
    return (
      <Space
        direction="vertical"
        size="middle"
      >
        <Text>
          <MailOutlined style={{marginRight: 8}} />
          {user.email}
        </Text>
        <Text>
          <PhoneOutlined style={{marginRight: 8}} />
          {user.phoneNumber || "Не указан"}
        </Text>
      </Space>
    );
  }

  return (
    <Form
      layout="vertical"
      form={form}
      disabled={!isEditing}
    >
      <Form.Item
        name="username"
        label="Имя пользователя"
        rules={[
          { required: true, message: "Введите имя пользователя" },
          { min: validation.username.min, message: `Минимум ${validation.username.min} символ` },
          { max: validation.username.max, message: `Максимум ${validation.username.max} символов` },
          { pattern: validation.username.pattern, message: validation.username.message },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Введите email" },
          { type: "email", message: "Неверный формат email" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Телефон"
        rules={[
          { pattern: validation.phone.pattern, message: validation.phone.message },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default UserInfoContent;
