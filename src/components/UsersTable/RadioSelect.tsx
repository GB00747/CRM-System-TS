import {Select} from "antd";
import {useDispatch} from "react-redux";
import {setTableParams} from "@/features/users/userSlice.ts";
const {Option} = Select;


const RadioSelect = ({ tableParams}) => {
  const dispatch = useDispatch()
  const handleChange = (value: string) => {
    if (value === "all") {
      // Убираем фильтр isBlocked
      const { isBlocked, ...rest } = tableParams;
      dispatch(setTableParams(rest));
      return;
    }

    const newParams = { ...tableParams };

    if (value === "blocked") {
      newParams.isBlocked = true;
    } else if (value === "active") {
      newParams.isBlocked = false;
    }

    dispatch(setTableParams(newParams));
  };


  return (
    <Select
      value={
        tableParams.hasOwnProperty('isBlocked')
          ? tableParams.isBlocked
            ? 'blocked'
            : 'active'
          : 'all'
      }
      onChange={handleChange}
      style={{width: 240, marginBottom: 16}}
      placeholder="Фильтр по статусу блокировки"
    >
      <Option value="all">Все пользователи</Option>
      <Option value="blocked">Заблокированные</Option>
      <Option value="active">Активные</Option>
    </Select>
  );
}

export default RadioSelect;
