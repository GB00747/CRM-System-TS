import styles from "./TodoListOfTasks.module.css";

import { Filter, TaskInfo } from "../../types/todoTypes.ts";

interface Props {
  handleChangeFilteredTasks: (filter: Filter) => void;
  filter: Filter;
  taskCounts: TaskInfo;
}

export default function TodoListOfTasks({
  handleChangeFilteredTasks,
  filter,
  taskCounts,
}: Props) {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <button
            className={`${styles.button} ${filter === Filter.All ? styles.active : ""}`}
            onClick={() => handleChangeFilteredTasks(Filter.All)}
          >
            Все ({taskCounts.all})
          </button>
        </li>
        <li className={styles.item}>
          <button
            className={`${styles.button} ${filter === Filter.InWork ? styles.active : ""}`}
            onClick={() => handleChangeFilteredTasks(Filter.InWork)}
          >
            В работе ({taskCounts.inWork})
          </button>
        </li>
        <li className={styles.item}>
          <button
            className={`${styles.button} ${filter === Filter.Completed ? styles.active : ""}`}
            onClick={() => handleChangeFilteredTasks(Filter.Completed)}
          >
            Сделано ({taskCounts.completed})
          </button>
        </li>
      </ul>
    </div>
  );
}
