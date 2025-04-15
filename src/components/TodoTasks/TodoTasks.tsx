import Task from "../Task/Task";
import styles from "./TodoTasks.module.css";
import {Task as TaskType} from '../../api/api.types.ts'


interface Props {
    tasks: TaskType[];
    updateTasks: () => Promise<void>;
}

export default function TodoTasks({ tasks, updateTasks }: Props) {
    return (
        <div>
            <ul className={styles.todoList}>
                {tasks.map((task) => (
                    <Task key={task.id} task={task} updateTasks={updateTasks} />
                ))}
            </ul>
        </div>
    );
}
