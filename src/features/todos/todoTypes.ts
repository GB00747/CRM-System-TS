export enum Filter {
  All = "all",
  Completed = "completed",
  InWork = "inWork",
}

export type Task = {
  created: string;
  id: number;
  isDone: boolean;
  title: string;
};

export type UpdateTask = Partial<Omit<Task, "id" | "created">>;

export type TaskInfo = {
  all: number;
  completed: number;
  inWork: number;
};



export type MetaResponse<T, N> = {
  data: T[];
  info: N;
  meta: {
    totalAmount: number;
  };
};

export type FilteredTasksResponse = MetaResponse<Task, TaskInfo>;
