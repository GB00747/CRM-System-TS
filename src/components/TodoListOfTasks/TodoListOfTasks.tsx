import { Segmented } from "antd";
import { Filter, TaskInfo } from "../../types/todoTypes.ts";

interface Props {
  handleClickFilteredTasks: (filter: Filter) => void;
  filter: Filter;
  taskCounts: TaskInfo;
}

export default function TodoListOfTasks({
  handleClickFilteredTasks,
  filter,
  taskCounts,
}: Props) {
  const options = [
    {
      label: `Все (${taskCounts.all})`,
      value: Filter.All,
    },
    {
      label: `В работе (${taskCounts.inWork})`,
      value: Filter.InWork,
    },
    {
      label: `Сделано (${taskCounts.completed})`,
      value: Filter.Completed,
    },
  ];

  return (
    <div style={{ padding: "16px", display: "flex", justifyContent: "center" }}>
      <Segmented<Filter>
        style={{ minWidth: "25em" }}
        options={options}
        value={filter}
        onChange={handleClickFilteredTasks}
        block
      />
    </div>
  );
}
