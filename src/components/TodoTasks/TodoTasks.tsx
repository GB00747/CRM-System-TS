import { List } from "antd";
import Task from "../Task/Task";
import { Task as TaskType } from "../../types/todoTypes.ts";

interface Props {
  tasks: TaskType[];
  updateTasks: () => Promise<void>;
}

export default function TodoTasks({ tasks, updateTasks }: Props) {
  return (
    <List
      dataSource={tasks}
      renderItem={(task) => (
        <List.Item key={task.id} style={{ padding: "0.5rem" }}>
          <Task task={task} updateTasks={updateTasks} />
        </List.Item>
      )}
      bordered
    />
  );
}
