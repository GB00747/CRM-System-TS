import { useState, useEffect } from "react";
import { filteredTasksApi } from "../api/api";
import {
  Task,
  FilteredTasksResponse,
  TaskInfo,
  Filter,
} from "../types/todoTypes.ts";

import "../Styles/App.css";
import TodoForm from "../components/TodoForm/TodoForm";
import TodoTasks from "../components/TodoTasks/TodoTasks";
import TodoListOfTasks from "../components/TodoListOfTasks/TodoListOfTasks";

export function TodoListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [taskCounts, setTaskCounts] = useState<TaskInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchFilteredTasksApi(filter);
  }, [filter]);

  const fetchFilteredTasksApi = async (filter: Filter): Promise<void> => {
    try {
      const data: FilteredTasksResponse | undefined =
        await filteredTasksApi(filter);
      if (data) {
        setTasks(data.data);
        setTaskCounts(data.info);
      }
    } catch (error) {
      console.error("Ошибка при загрузке отфильтрованных задач:", error);
      alert("Ошибка при загрузке отфильтрованных задач");
    }
  };

  const updateTasks = (): Promise<void> => fetchFilteredTasksApi(filter);

  const handleChangeFilteredTasks = (filter: Filter) => {
    setFilter(filter);
  };

  return (
    <>
      <TodoForm updateTasks={updateTasks} />
      <TodoListOfTasks
        handleChangeFilteredTasks={handleChangeFilteredTasks}
        taskCounts={taskCounts}
        filter={filter}
      />
      <TodoTasks tasks={tasks} updateTasks={updateTasks} />
    </>
  );
}
