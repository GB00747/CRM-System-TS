import { useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { FaRegSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import {
  Form,
  Input,
  Button,
  message,
  Checkbox,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import { deleteTaskApi, updateTaskApi } from "../../api/api";
import { Task as TaskType } from "../../types/todoTypes.ts";

interface Props {
  task: TaskType;
  updateTasks: () => Promise<void>;
}

export default function Task({ task, updateTasks }: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [changingTaskValue, setChangingTaskValue] = useState<string>(
    task.title,
  );

  const handleClickDeleteTask = async (id: number) => {
    try {
      await deleteTaskApi(id);
      await updateTasks();
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      message.error("Не удалось удалить задачу");
    }
  };

  const handleClickChangeIsDone = async (id: number, task: TaskType) => {
    try {
      await updateTaskApi(id, { isDone: !task.isDone });
      await updateTasks();
    } catch (error) {
      console.error("Ошибка при изменении статуса задачи:", error);
      message.error("Ошибка при изменении статуса задачи");
    }
  };

  const handleClickStartEdit = () => {
    setIsEditing(true);
  };

  const handleClickEndEdit = () => {
    setIsEditing(false);
  };

  const handleClickCancelEdit = () => {
    setChangingTaskValue(task.title);
    handleClickEndEdit();
  };

  const handleClickSubmitEditTask = async (
    values: { title: string },
    id: number,
  ) => {
    try {
      const updatedTask = await updateTaskApi(id, { title: values.title });

      if (!updatedTask) {
        message.error("Не удалось обновить задачу");
        return;
      }
      await updateTasks();
      setChangingTaskValue(updatedTask.title);
      handleClickEndEdit();
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      message.error("Произошла ошибка при обновлении задачи");
    }
  };

  const initialTask = (
    <Row
      align="middle"
      justify="space-between"
      style={{
        width: "100%",
        padding: "8px 16px",
        backgroundColor: "#fff",
        borderRadius: 8,
      }}
    >
      <Col>
        <Row align="middle" gutter={8}>
          <Col>
            <Checkbox
              checked={task.isDone}
              onChange={() => handleClickChangeIsDone(task.id, task)}
            />
          </Col>
          <Col>
            <Typography.Text>{task.title}</Typography.Text>
          </Col>
        </Row>
      </Col>

      <Col>
        <Row align="middle" gutter={8}>
          <Col>
            <Button
              type="default"
              onClick={handleClickStartEdit}
              icon={<MdEditSquare />}
              title="Редактировать"
            />
          </Col>
          <Col>
            <Button
              type="default"
              danger
              onClick={() => handleClickDeleteTask(task.id)}
              icon={<AiFillDelete />}
              title="Удалить"
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const editTask = (
    <Form
      onFinish={(values) => handleClickSubmitEditTask(values, task.id)}
      initialValues={{ title: changingTaskValue }}
      layout="inline"
      style={{ width: "100%", display: "flex", justifyContent: "space-around" }}
    >
      <Form.Item
        name="title"
        rules={[
          { required: true, message: "Поле не может быть пустым" },
          {
            min: 2,
            max: 64,
            message: "Количество символов должно быть от 2 до 64",
          },
        ]}
        style={{ flexGrow: 1, padding: 0 }}
      >
        <Input
          value={changingTaskValue}
          onChange={(event) => setChangingTaskValue(event.target.value)}
          placeholder="Изменить задачу"
        />
      </Form.Item>
      <Form.Item style={{ margin: 0 }}>
        <Space>
          <Button type="primary" htmlType="submit" icon={<FaRegSave />}>
            Сохранить
          </Button>
          <Button
            type="default"
            onClick={handleClickCancelEdit}
            icon={<MdCancel />}
          >
            Отменить
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return isEditing ? editTask : initialTask;
}
