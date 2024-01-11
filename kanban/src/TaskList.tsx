import TaskManager from "./Class/TaskManager";
import Task from './interface'

export default function TaskList(props: { state: number, tasks: Task[] }) {

    const taskManager = new TaskManager()

    function deleteTask (e) {
        let id = e.target.id
        taskManager.deleteTask(id)
    }

    function selectTask() {

    }

    return <>
        <div className="container">
            {props.tasks.filter(tasks => tasks.taskState == props.state).map(task => (
                <div className="item" key={task.id} onClick={selectTask}>
                    {task.taskName} <button onClick={deleteTask} id={""+task.id}>X</button>
                </div>
            ))}
        </div>
    </>;
}