import React from "react";
import styles from "./Task.module.css";

import { MdEditSquare } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import { useState} from "react";

import { deleteTaskApi, updateTaskApi } from "../../api/api";

import { Task as TaskType } from "../../types/todoTypes.ts";

interface Props {
  task: TaskType;
  updateTasks: () => Promise<void>;
}

export default function Task({ task, updateTasks }: Props) {
  const [changingTaskValue, setChangingTaskValue] = useState<string>(
    task.title,
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);



  const handleClickDeleteTask = async (id: number) => {
    try {
      await deleteTaskApi(id);
      await updateTasks();
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      alert("Не удалось удалить задачу");
    }
  };

  const handleChangeIsDone = async (id: number, task: TaskType) => {
    try {
      await updateTaskApi(id, { isDone: !task.isDone });
      await updateTasks();
    } catch (error) {
      console.error("Ошибка при изменении статуса задачи:", error);
      alert("Ошибка при изменении статуса задачи");
    }
  };

  const handleClickStartEdit = () => {
    setIsEditing(true);
  };

  const handleEndEdit = () => {
    setIsEditing(false);
  };

  const handleClickCancelEdit = (value: string) => {
    setChangingTaskValue(value);
    handleEndEdit();
  };


  const handleSubmitEditTask = async (
    event: React.FormEvent<HTMLFormElement>,
    id: number,
    title: string,
  ) => {
    event.preventDefault();

    const trimTitle = title.trim();
    if (trimTitle.length < 2 || trimTitle.length > 64) {
      alert("Количество символов минимум 2 максимум 64");
      return;
    }

    try {
      const updateTask = await updateTaskApi(id, { title: trimTitle });

      if (!updateTask) {
        alert("Не удалось обновить задачу");
        return;
      }
      await updateTasks();
      setChangingTaskValue(updateTask.title);
      handleEndEdit();
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      alert("Произошла ошибка при обновлении задачи");
    }
  };

  const initialTask = (
    <li className={styles.task}>
      <input
        type="checkbox"
        checked={task.isDone}
        onChange={() => handleChangeIsDone(task.id, task)}
        className={styles.checkbox}
      />
      <div className={styles.title}>{task.title}</div>
      <button
        type="button"
        onClick={handleClickStartEdit}
        className={styles.button}
        title="Редактировать"
      >
        <MdEditSquare className={styles.icon} />
      </button>
      <button
        type="button"
        onClick={() => handleClickDeleteTask(task.id)}
        className={`${styles.button} ${styles.deleteButton}`}
        title="Удалить"
      >
        <AiFillDelete className={styles.icon} />
      </button>
    </li>
  );

  const editTask = (
    <li>
      <form
        className={styles.form}
        onSubmit={(event) =>
          handleSubmitEditTask(event, task.id, changingTaskValue)
        }
      >
        <input
          className={styles.input}
          type="text"
          value={changingTaskValue}
          onChange={(event) => setChangingTaskValue(event.target.value)}

        />
        <button className={styles.button} type="submit" title="Сохранить">
          <FaRegSave className={styles.icon} />
        </button>
        <button
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={() => handleClickCancelEdit(task.title)}
          type="button"
          title="Отменить"
        >
          <MdCancel className={styles.icon} />
        </button>
      </form>
    </li>
  );

  return isEditing ? editTask : initialTask;
}
