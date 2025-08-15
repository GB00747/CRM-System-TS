import {Alert, Avatar, Card, Col, Row, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useForm} from "antd/es/form/Form";
import UserInfoContent from "@/components/UsersTable/UserInfoContent.tsx";
import {Profile} from "@/features/auth/authTypes.ts";
import {UserRequest} from "@/features/users/usersTypes.ts";
import {useNavigate} from "react-router-dom";

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
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [form] = useForm()
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1)
  }

  const handleSwitchEditing = () => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
    setIsEditing(prevState => !prevState)
  }

  const getChangedFields = <T extends object>(original: T, updated: T): Partial<T> => {
    return Object.keys(updated).reduce((acc, key) => {
      const k = key as keyof T;
      const origValue = original[k];
      const updatedValue = updated[k];

      const isArray = Array.isArray(origValue) && Array.isArray(updatedValue);
      const isEqual = isArray
        ? JSON.stringify(origValue) === JSON.stringify(updatedValue)
        : origValue === updatedValue;

      if (!isEqual) {
        acc[k] = updatedValue;
      }
      return acc;
    }, {} as Partial<T>);
  }

  const onSave = (values: UserRequest) => {
    if (!user) {
      return
    }
    const changedFields = getChangedFields(user, values);

    if (Object.keys(changedFields).length > 0) {
      if (userId) {
        handleUpdateUserProfile(changedFields, userId);
      } else {
        handleUpdateUserProfile(changedFields);
      }
    }
    setIsEditing(false);
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

  return (
    <Card
      style={{borderRadius: 10}}
      title={cardTitle}
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
        onSave={onSave}
        handleSwitchEditing={handleSwitchEditing}
        handleBack={handleBack}
      />
    </Card>
  );
}

export default InfoCard;