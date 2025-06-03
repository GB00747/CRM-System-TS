import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store.ts";
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

import { Task as TaskType } from "@/features/todos/todoTypes.ts";

import { deleteTodo, updateTodo } from "@/features/todos/TodoSlice.ts";

interface Props {
  task: TaskType;
  updateTasks: () => Promise<void>;
}

export default function Task({ task, updateTasks }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [taskValue, setTaskValue] = useState<string>(task.title);

  const [form] = Form.useForm<{ title: string }>();

  const handleClickDeleteTask = async (id: number) => {
    try {
      await dispatch(deleteTodo(id)).unwrap();
      await updateTasks();
      message.success("Задача удалена");
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      message.error("Не удалось удалить задачу");
    }
  };

  const handleClickChangeIsDone = async (id: number, task: TaskType) => {
    try {
      await dispatch(updateTodo({ id, data: { isDone: !task.isDone } })).unwrap();
      await updateTasks();
      message.success("Статус задачи обновлен");
    } catch (error) {
      console.error("Ошибка при изменении статуса задачи:", error);
      message.error("Ошибка при изменении статуса задачи");
    }
  };

  const handleClickStartEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({ title: taskValue });
  };

  const handleClickEndEdit = () => {
    setIsEditing(false);
  };

  const handleClickCancelEdit = () => {
    form.setFieldsValue({ title: task.title });
    setTaskValue(task.title);
    handleClickEndEdit();
  };

  const handleClickSubmitEditTask = async (
    values: { title: string },
    id: number
  ) => {
    try {
      const updatedTask = await dispatch(
        updateTodo({ id, data: { title: values.title } })
      ).unwrap();

      if (!updatedTask) {
        message.error("Не удалось обновить задачу");
        return;
      }

      await updateTasks();
      setTaskValue(updatedTask.title);
      form.setFieldsValue({ title: updatedTask.title });
      handleClickEndEdit();
      message.success("Задача обновлена");
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
      form={form}
      onFinish={(values) => handleClickSubmitEditTask(values, task.id)}
      layout="inline"
      style={{ width: "100%", display: "flex", justifyContent: "space-around" }}
    >
      <Form.Item
        initialValue={taskValue}
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
          value={taskValue}
          onChange={(e) => setTaskValue(e.target.value)}
          placeholder="Изменить задачу"
          autoFocus
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
