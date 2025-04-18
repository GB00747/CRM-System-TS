import styles from "./TodoForm.module.css";
import { addTaskApi } from "../../api/api";
import { useState, FormEvent, useRef } from "react";

type TodoFormProps = {
  updateTasks: () => void;
};

export default function TodoForm({ updateTasks }: TodoFormProps) {
  const [taskValue, setTaskValue] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const addTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = taskValue.trim();
    if (!trimmedValue) return;

    if (trimmedValue.length < 2 || trimmedValue.length > 64) {
      alert("Количество символов: минимум 2, максимум 64");
      return;
    }

    try {
      const newTask = await addTaskApi(trimmedValue);
      if (newTask) {
        setTaskValue("");
        updateTasks();
      }
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
      alert("Произошла ошибка при добавлении задачи");
    }
  };

  const handleKeyboardKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Escape") {
      setTaskValue("");
      inputRef.current?.blur();
    }
  };

  return (
    <form className={styles.form} onSubmit={addTask}>
      <input
        className={styles.input}
        type="text"
        placeholder="Task to be done..."
        value={taskValue}
        onKeyDown={handleKeyboardKeyDown}
        onChange={(event) => setTaskValue(event.target.value)}
        ref={inputRef}
      />
      <button className={styles.button} type="submit" title="Добавить">
        Add
      </button>
    </form>
  );
}
