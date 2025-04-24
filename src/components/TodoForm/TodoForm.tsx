import { addTaskApi } from "../../api/api";
import { useState } from "react";
import { Button, Form, Input, message } from "antd";

type TodoFormProps = {
  updateTasks: () => void;
};

export default function TodoForm({ updateTasks }: TodoFormProps) {
  const [taskValue, setTaskValue] = useState<string>("");

  const handleButtonAddTask = async () => {
    const trimmedValue = taskValue.trim();
    if (!trimmedValue) return;

    try {
      const newTask = await addTaskApi(trimmedValue);
      if (newTask) {
        setTaskValue("");
        updateTasks();
        message.success("Задача добавлена");
      }
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
      message.error("Произошла ошибка при добавлении задачи");
    }
  };

  return (
    <Form
      layout="inline"
      onFinish={handleButtonAddTask}
      style={{ display: "flex" }}
    >
      <Form.Item
        style={{ flexGrow: "1" }}
        name="title"
        rules={[
          {
            required: true,
            message: "Задача не может быть пустой",
          },
          {
            min: 2,
            message: "Название задачи должно содержать минимум 2 символа",
          },
          {
            max: 64,
            message: "Название задачи не может быть длиннее 64 символов",
          },
        ]}
      >
        <Input
          type="text"
          placeholder="Task to be done..."
          value={taskValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setTaskValue(event.target.value)
          }
        />
      </Form.Item>
      <Form.Item style={{ margin: "0" }}>
        <Button type="primary" htmlType="submit" title="Добавить">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}
