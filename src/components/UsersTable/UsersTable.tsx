import React, {useState} from 'react'
import {Profile} from "@/features/auth/authTypes.ts";
import type {ColumnsType} from 'antd/es/table';
import {Button, Popconfirm, Space, Table, Tag} from 'antd';
import {setTableParams} from '@/features/users/userSlice';
import {useDispatch} from "react-redux";
import {UserFilters} from "@/features/users/usersTypes.ts";
import RoleModal from "@/components/UsersTable/RoleModal.tsx";


interface UserTableProps {
  users: Profile[] | null;
  onViewProfile: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleBlock: (id: number, isBlocked: boolean) => void;
  tableParams: UserFilters;
  total: number;
}

const UsersTable: React.FC<UserTableProps> = ({
                                                users,
                                                onViewProfile,
                                                onDelete,
                                                onToggleBlock,
                                                tableParams,
                                                total
                                              }) => {


  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null)

  const handleToggleModalVisible = (profile) => {
    if (profile) {
      setSelectedProfile(profile)
    }
    setModalIsVisible(prev => !prev);
  };
  const columns: ColumnsType<Profile> = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      sortOrder: tableParams.sortBy === 'username' ? (tableParams.sortOrder === 'asc' ? 'ascend' : 'descend') : null
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortOrder: tableParams.sortBy === 'email' ? (tableParams.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (isBlocked: boolean) => (
        <Tag color={isBlocked ? 'red' : 'green'}>
          {isBlocked ? 'Заблокирован' : 'Активен'}
        </Tag>
      ),
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles.map((role) => (
            <Tag
              key={role}
              color="blue"
            >
              {role}
            </Tag>
          ))}
        </>
      )
    },
    {
      title: 'Номер телефона',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phoneNumber) => phoneNumber ? phoneNumber : '-'

    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onViewProfile(record.id)}>Профиль</Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этого пользователя?"
            onConfirm={() => onDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              danger
            >Удалить</Button>
          </Popconfirm>
          <Button
            onClick={() => handleToggleModalVisible(record)}
          >
            Изменить роли
          </Button>
          <Button
            onClick={() => onToggleBlock(record.id, record.isBlocked)}
            type="dashed"
          >
            {record.isBlocked ? 'Разблокировать' : 'Заблокировать'}
          </Button>
        </Space>
      ),
    },

  ]

  const dispatch = useDispatch()

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users ?? []}
        onChange={(pagination, filters, sorter) => {
          const currentPage = pagination.current;
          const pageSize = pagination.pageSize ?? 20;
          const sortField = (sorter as any).field as string | undefined;
          const sortOrder =
            (sorter as any).order === 'ascend'
              ? 'asc'
              : (sorter as any).order === 'descend'
                ? 'desc'
                : undefined;

          console.log(sortField, sortOrder)

          dispatch(setTableParams({
            pageSize,
            currentPage,
            offset: currentPage - 1,
            limit: pageSize,
            sortBy: sortField,
            sortOrder,
          }));
        }}
        pagination={{
          current: tableParams.currentPage || 1,
          pageSize: tableParams.pageSize || 20,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `Всего ${total} пользователей`,
        }}
      />
      {selectedProfile && (
        <RoleModal
          handleToggleModalVisible={() => handleToggleModalVisible()}
          modalIsVisible={modalIsVisible}
          user={selectedProfile}
        />
      )}
    </>
  );
}

export default UsersTable;