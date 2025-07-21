
import { Button, Form, Input, message } from "antd";
import {useDispatch} from "react-redux";
import {addTask} from "@/features/todos/todoThunks.ts";

type TodoFormProps = {
  updateTasks: () => void;
};

export default function TodoForm({ updateTasks }: TodoFormProps) {
  const [form] = Form.useForm<{ title: string }>();
  const dispatch = useDispatch()

  const handleButtonAddTask = async (values: { title: string }) => {
    const trimmedValue = values.title.trim();
    if (!trimmedValue) return;

    try {
      const newTask = await dispatch(addTask(trimmedValue)).unwrap();
      if (newTask) {
        form.resetFields();
        message.success("Задача добавлена");
        updateTasks();
      }
    } catch (error) {
      console.error("Ошибка при добавлении задачи:", error);
      message.error("Произошла ошибка при добавлении задачи");
    }
  };

  return (
    <Form
      form={form}
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
        <Input type="text" placeholder="Task to be done..." />
      </Form.Item>
      <Form.Item style={{ margin: "0" }}>
        <Button type="primary" htmlType="submit" title="Добавить">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}
