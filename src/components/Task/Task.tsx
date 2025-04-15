import React from "react";
import styles from "./Task.module.css";

import { MdEditSquare } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import { useState } from "react";

import {
  deleteTaskApi,
  updateTaskStatusApi,
  updateTaskTitleApi,
} from "../../api/api";

import {Task as TaskType} from '../../api/api.types.ts'


interface Props {
  task: TaskType;
  updateTasks: () => Promise<void>;
}

export default function Task({ task, updateTasks }: Props) {
  const [changingTaskValue, setChangingTaskValue] = useState<string>(task.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleDeleteTask = async (id: number) => {
    await deleteTaskApi(id);
    await updateTasks();
  };

  const handleSwitchIsDone = async (id: number) => {
    await updateTaskStatusApi(id);
    await updateTasks();
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleEndEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = (value: string) => {
    setChangingTaskValue(value);
    handleEndEdit();
  };

  const handleChangeValueInInput = async (
      event: React.FormEvent<HTMLFormElement>,
      id: number,
      title: string
  ) => {
    event.preventDefault();

    const checkLengthOfValue = title.trim().length;
    if (checkLengthOfValue < 2 || checkLengthOfValue > 64) {
      alert("Количество символов минимум 2 максимум 64");
      return;
    }

    try {
      const updateTaskValue = await updateTaskTitleApi(id, title);

      if (!updateTaskValue) {
        alert('Не удалось обновить задачу');
        return
      }
      await updateTasks();
      setChangingTaskValue(updateTaskValue.title);
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
            onChange={() => handleSwitchIsDone(task.id)}
            className={styles.checkbox}
        />
        <div className={styles.title}>{task.title}</div>
        <button
            type="button"
            onClick={handleStartEdit}
            className={styles.button}
            title="Редактировать"
        >
          <MdEditSquare className={styles.icon} />
        </button>
        <button
            type="button"
            onClick={() => handleDeleteTask(task.id)}
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
            onSubmit={(event) => handleChangeValueInInput(event, task.id, changingTaskValue)}
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
              onClick={() => handleCancelEdit(task.title)}
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
