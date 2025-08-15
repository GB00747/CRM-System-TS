import {useDispatch, useSelector} from "react-redux";
import UsersTable from "@/components/UsersTable/UsersTable.tsx";
import {AppDispatch, RootState} from "@/app/store.ts";
import React, {useEffect, useState} from "react";
import {
  blockUserProfile,
  deleteUserProfile,
  getUserInfo,
  getUsers,
  unblockUserProfile
} from "@/features/users/usersThunks.ts";

import {Alert, Input, notification, Spin} from "antd";
import {useNavigate} from "react-router-dom";
import RadioSelect from "@/components/UsersTable/RadioSelect.tsx";
import {setTableParams} from "@/features/users/userSlice.ts";

function UsersPage() {
  const {
    users,
    error,
    tableParams,
    total
  } = useSelector((state: RootState) => state.user);

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(getUsers(tableParams)).finally(() => {
        setIsFirstLoad(false);
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [dispatch, tableParams]);


  const handleGetProfile = (id: number) => {
    dispatch(getUserInfo(id))
    navigate(`/app/users/${id}`)
  }

  const handleDeleteProfile = async (id: number) => {
    try {
      await dispatch(deleteUserProfile(id)).unwrap()
      notification.success({
        message: 'Успешно удалено',
        description: 'Данные были успешно удалены',
        duration: 2,
      });
    } catch (error) {
      error.message(error)
    }
  }

  const handleToggleBlockProfile = async (id: number, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await dispatch(unblockUserProfile(id)).unwrap()
        notification.success({
          message: 'Успешно изменен статус блокировки',
          description: 'Пользователь успешно разблокирован',
          duration: 2,
        });
      } else {
        await dispatch(blockUserProfile(id)).unwrap()
        notification.success({
          message: 'Успешно изменен статус блокировки',
          description: 'Пользователь успешно заблокирован',
          duration: 2,
        });
      }
    } catch (error) {
      console.error(error)
    }

  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    dispatch(setTableParams({...tableParams, search}));
  }

  if (isFirstLoad) {
    return <Spin
      tip="Загрузка пользователей..."
      size="large"
      fullscreen
    />;
  }

  if (error) {
    return <Alert
      message="Ошибка загрузки"
      description={error}
      type="error"
    />;
  }

  return (
    <>
      <Input.Search
        placeholder="Поиск по имени или email"
        allowClear
        value={tableParams.search || ''}
        onChange={handleSearchChange}
      />
      <RadioSelect
        tableParams={tableParams}
      />
      <UsersTable
        users={users?.data || []}
        onViewProfile={handleGetProfile}
        onDelete={handleDeleteProfile}
        onToggleBlock={handleToggleBlockProfile}
        tableParams={tableParams}
        total={total}
      />
    </>
  );
}

export default UsersPage