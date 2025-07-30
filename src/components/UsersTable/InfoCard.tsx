import {Alert, Avatar, Card, Col, Row, Button} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {Typography} from 'antd';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import UserInfoContent from "@/components/UsersTable/UserInfoContent.tsx";
import {Profile} from "@/features/auth/authTypes.ts";
import {UserRequest} from "@/features/users/usersTypes.ts";

const {Title} = Typography

type InfoCardProps = {
  user: Profile | null;
  error?: string | null;
  handleUpdateUserProfile: (values: UserRequest, id?: number) => void;
  userId?: number;
};

function InfoCard({
                    user,
                    error,
                    handleUpdateUserProfile,
                    userId
                  }: InfoCardProps) {

  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()
  const [form] = useForm()

  const hadleSwitchEditing = () => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
    setIsEditing(prevState => !prevState)
  }

  const onSave = async () => {
    try {
      const values = await form.validateFields();

      if (userId) {
        handleUpdateUserProfile(values, userId);
      } else {
        handleUpdateUserProfile(values);
      }

      setIsEditing(false);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  const cardTitle = (
    <Row
      gutter={16}
      align="middle"
      style={{margin: '1em'}}
    >
      <Col>
        <Avatar
          size={64}
          icon={<UserOutlined />}
          style={{backgroundColor: "#1890ff"}}
        />
      </Col>
      <Col>
        <Title
          level={4}
          style={{margin: 0}}
        >
          {user?.username}
        </Title>
      </Col>
    </Row>
  )

  const defaultActions = [
    <div
      key="actions"
      style={{display: 'flex', gap: 8, justifyContent: 'left', marginLeft: '1rem'}}
    >
      <Button
        type="primary"
        onClick={hadleSwitchEditing}
        key="edit"
      >Редактировать</Button>
      <Button
        onClick={() => navigate(-1)}
        key="back"
      >Вернуться</Button>
    </div>
  ]

  const editActions = [
    <div
      key="actions"
      style={{display: 'flex', gap: 8, justifyContent: 'left'}}
    >
      <Button
        type="primary"
        onClick={onSave}
        key="save"
      >
        Сохранить
      </Button>
      <Button
        key="cancel"
        onClick={hadleSwitchEditing}
      >
        Отменить
      </Button>
    </div>
  ];


  return (
    <Card
      style={{borderRadius: 10}}
      title={cardTitle}
      actions={isEditing ? editActions : defaultActions}
    >
      {error && (
        <Alert
          message="Ошибка"
          description={typeof error === 'string' ? error : error.message || JSON.stringify(error)}
          type="error"
          showIcon
          style={{marginBottom: 16}}
        />
      )}
      <UserInfoContent
        user={user}
        form={form}
        isEditing={isEditing}
      />
    </Card>

  );
}

export default InfoCard;