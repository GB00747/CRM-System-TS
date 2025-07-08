import {useState, useEffect, useCallback} from "react";
import {Task, TaskInfo, Filter} from "../features/todos/todoTypes.ts";
import {useDispatch, useSelector} from "react-redux";

import {fetchTodos} from '../features/todos/todoThunks.ts'
import {RootState, AppDispatch} from "../app/store.ts";

import TodoForm from "../components/TodoForm/TodoForm";
import TodoTasks from "../components/TodoTasks/TodoTasks";
import TodoListOfTasks from "../components/TodoListOfTasks/TodoListOfTasks";




function TodoListPage() {

  const todos: Task[] = useSelector(
    (state: RootState) => state.todos.todos
  )

  const taskCounts: TaskInfo = useSelector(
    (state: RootState) => state.todos.info
  )

  const dispatch: AppDispatch = useDispatch()

  const [filter, setFilter] = useState<Filter>(Filter.All);

  const fetchTasksByFilter = useCallback(() => {
    dispatch(fetchTodos(filter));
  }, [dispatch, filter])


  useEffect(() => {

    fetchTasksByFilter();

    const interval = setInterval(() => {
      fetchTasksByFilter();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchTasksByFilter]);

  const updateTasks = async () => {
    fetchTasksByFilter()
  };

  const handleClickFilteredTasks = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  return (
    <>
      <TodoForm updateTasks={updateTasks}/>
      <TodoListOfTasks
        handleClickFilteredTasks={handleClickFilteredTasks}
        taskCounts={taskCounts}
        filter={filter}
      />
      <TodoTasks tasks={todos} updateTasks={updateTasks}/>
    </>
  );
}

export default TodoListPage