import {MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {Typography, Space, Form, Input, FormInstance, Button} from "antd";
import {validation} from "@/constants/validation.ts";
import {UserRequest} from "@/features/users/usersTypes.ts";

const {Text} = Typography;

type UserInfoContentProps = {
  isEditing: boolean;
  form: FormInstance;
  user: {
    username: string;
    email: string;
    phoneNumber?: string | null;
  } | null;
  onSave: (values: UserRequest) => void;
  handleSwitchEditing: () => void;
  handleBack: () => void
};


const UserInfoContent = ({
                           isEditing,
                           form,
                           user,
                           onSave,
                           handleSwitchEditing,
                           handleBack
                         }: UserInfoContentProps) => {

  if (!user) {
    return null;
  }

  if (!isEditing) {
    return (
      <>
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
    <div
      key="actions"
      style={{
        display: 'flex',
        gap: 8,
        justifyContent: 'left',
        marginLeft: '1rem'
      }}
    >
      <Button
        type="primary"
        onClick={handleSwitchEditing}
        key="edit"
      >Редактировать</Button>
      <Button
        onClick={handleBack}
        key="back"
      >Вернуться</Button>
    </div>
      </>
    );
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSave}
    >
      <Form.Item
        name="username"
        label="Имя пользователя"
        rules={[
          {required: true, message: "Введите имя пользователя"},
          {
            min: validation.username.min,
            message: `Минимум ${validation.username.min} символ`
          },
          {
            max: validation.username.max,
            message: `Максимум ${validation.username.max} символов`
          },
          {
            pattern: validation.username.pattern,
            message: validation.username.message
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {required: true, message: "Введите email"},
          {type: "email", message: "Неверный формат email"},
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Телефон"
        rules={[
          {
            pattern: validation.phone.pattern,
            message: validation.phone.message
          },
        ]}
      >
        <Input />
      </Form.Item>
      <div
        key="actions"
        style={{display: 'flex', gap: 8, justifyContent: 'left'}}
      >
        <Button
          type="primary"
          htmlType='submit'
          key="save"
        >
          Сохранить
        </Button>
        <Button
          key="cancel"
          onClick={handleSwitchEditing}
        >
          Отменить
        </Button>
      </div>
    </Form>
  );
};

export default UserInfoContent;
