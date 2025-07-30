import {Form, Modal, Select, Button} from 'antd';
import {useDispatch} from "react-redux";
import {addUserRights} from "@/features/users/usersThunks.ts";

function RoleModal({ handleToggleModalVisible, modalIsVisible, user }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const uniqueArray = [...new Set([...user.roles, ... values.roles])]
        dispatch(addUserRights({id: user.id, roles: uniqueArray}))
        handleToggleModalVisible();
      });
  };

  const handleResetRoles = () => {
    form.setFieldsValue({ roles: ['USER'] })
    dispatch(addUserRights({ id: user.id, roles: ['USER'] }))
  }

  const handleCancel = () => {
    form.resetFields();
    handleToggleModalVisible();
  };

  const allRoles = [
    { value: 'ADMIN', label: 'Администратор' },
    { value: 'MODERATOR', label: 'Модератор' },
    { value: 'USER', label: 'Пользователь' },
  ];


  return (
    <Modal
      title="Изменить роли пользователя"
      open={modalIsVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="reset" onClick={handleResetRoles}>
          Сбросить роли
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Сохранить
        </Button>
      ]}
    >
      <Form form={form}>
        <Form.Item
          name="roles"
          label="Роли"
          rules={[{ required: true, message: 'Пожалуйста, выберите хотя бы одну роль' }]}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Выберите роли"
            options={allRoles}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RoleModal;