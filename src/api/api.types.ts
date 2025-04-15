export type Task = {
  created: string;
  id: number;
  isDone: boolean;
  title: string;
};

export type TaskInfo = {
  all: number;
  completed: number;
  inWork: number;
};

export type TaskMeta = {
  totalAmount: number;
};

export type FilteredTasksResponse = {
  data: Task[];
  info: TaskInfo;
  meta: TaskMeta;
};

export type Filter = "all" | "completed" | "inWork";
