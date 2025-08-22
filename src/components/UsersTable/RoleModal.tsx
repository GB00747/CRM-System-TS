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

  const rolesAreEqual = (a: Roles[] = [], b: Roles[] = []): boolean => {
    if (a.length !== b.length) return false;
    const bSet = new Set(b);
    for (const role of a) {
      if (!bSet.has(role)) return false;
    }
    return true;
  };

  const handleSubmit = (values: { roles: Roles[] }) => {

    if (!user) {
      return
    }

    if (rolesAreEqual(values.roles, user.roles)) {
      notification.info({
        message: 'Вы выбрали те же роли',
        description: 'Изменений не обнаружено',
        duration: 2,
      })
      return
    }

    dispatch(addUserRights({id: user.id, roles: values.roles}));
    notification.success({message: 'Роли обновлены', duration: 2});
    handleToggleModalVisible();
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
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
      >
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '16px'
          }}
        >
          <Button
            key="cancel"
            onClick={() => handleToggleModalVisible()}
          >
            Отмена
          </Button>
          <Button
            key="submit"
            type="primary"
            htmlType='submit'
          >
            Сохранить
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default RoleModal;