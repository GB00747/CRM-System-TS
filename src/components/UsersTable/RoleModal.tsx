import {Form, Modal, Select, Button, notification, Tag} from 'antd';
import {useDispatch} from "react-redux";
import {addUserRights} from "@/features/users/usersThunks.ts";
import {useEffect} from "react";
import {Profile} from "@/features/auth/authTypes.ts";
import {Roles} from "@/features/auth/authTypes.ts";

type RoleModalProps = {
  handleToggleModalVisible: (profile: Profile | null) => void
  modalIsVisible: boolean
  user: Profile | null
}

function RoleModal({
                     handleToggleModalVisible,
                     modalIsVisible,
                     user
                   }: RoleModalProps) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (modalIsVisible && user) {
      form.setFieldsValue({roles: user?.roles || ['USER']});
    }
  }, [modalIsVisible, user, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        dispatch(addUserRights({id: user.id, roles: values.roles}));
        notification.success({message: 'Роли обновлены', duration: 2});
        handleToggleModalVisible();
      });
  };

  const allRoles = [
    {value: Roles.ADMIN, label: 'Админ'},
    {value: Roles.MODERATOR, label: 'Модератор'},
    {value: Roles.USER, label: 'Пользователь'},
  ];

  return (
    <Modal
      title="Изменение ролей"
      open={modalIsVisible}
      onCancel={() => handleToggleModalVisible()}
      footer={[
        <Button
          key="cancel"
          onClick={() => handleToggleModalVisible()}
        >
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
        >
          Сохранить
        </Button>
      ]}
    >
      <Form form={form}>
        <Form.Item
          name="roles"
          rules={
            [{
              required: true,
              message: 'Пожалуйста, выберите хотя бы одну роль.'
            }]}
        >
          <Select
            mode="multiple"
            placeholder="Выберите роли"
            options={allRoles}
            style={{width: '100%'}}
            tagRender={({label, closable, onClose}) => (
              <Tag
                closable={closable}
                onClose={onClose}
              >
                {label}
              </Tag>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RoleModal;