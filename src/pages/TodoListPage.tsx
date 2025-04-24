import { useState, useEffect, useRef } from "react";
import { filteredTasksApi } from "../api/api";
import { Task, TaskInfo, Filter } from "../types/todoTypes.ts";

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

  const intervalRef = useRef<number | null>(null);

  const fetchAndSetTasks = async (filter: Filter) => {
    try {
      const data = await filteredTasksApi(filter);
      if (data) {
        setTasks(data.data);
        if (data.info) setTaskCounts(data.info);
      }
    } catch (error) {
      console.error("Ошибка при загрузке отфильтрованных задач:", error);
      alert("Ошибка при загрузке отфильтрованных задач");
    }
  };

  useEffect(() => {
    fetchAndSetTasks(filter);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      fetchAndSetTasks(filter);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [filter]);

  const updateTasks = async () => {
    await fetchAndSetTasks(filter);
  };

  const handleClickFilteredTasks = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  return (
    <>
      <TodoForm updateTasks={updateTasks} />
      <TodoListOfTasks
        handleClickFilteredTasks={handleClickFilteredTasks}
        taskCounts={taskCounts}
        filter={filter}
      />
      <TodoTasks tasks={tasks} updateTasks={updateTasks} />
    </>
  );
}
