import styles from "./TodoForm.module.css";
import { addTaskApi } from "../../api/api";
import { useState, FormEvent } from "react";

type TodoFormProps = {
  updateTasks: () => void;
};

export default function TodoForm({ updateTasks }: TodoFormProps) {
  const [taskValue, setTaskValue] = useState<string>("");

  const addTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = taskValue.trim();
    if (!trimmedValue) return;

    if (trimmedValue.length < 2 || trimmedValue.length > 64) {
      alert("Количество символов: минимум 2, максимум 64");
      return;
    }

    const newTask = await addTaskApi(trimmedValue);
    if (newTask) {
      setTaskValue("");
      updateTasks();
    }
  };



  return (
    <form className={styles.form} onSubmit={addTask}>
      <input
        className={styles.input}
        type="text"
        placeholder="Task to be done..."
        value={taskValue}
        onChange={(event) => setTaskValue(event.target.value)}
      />
      <button className={styles.button} type="submit" title="Добавить">
        Add
      </button>
    </form>
  );
}
