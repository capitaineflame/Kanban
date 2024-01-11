
import { useForm } from 'react-hook-form';
import TaskManager from './../Class/TaskManager'

interface Task {
    id: number,
    taskName: string,
    taskDescription: string,
    taskState: number
}

export default function TaskForm(props: { task: Task }) {

    let taskManager = new TaskManager()

    const { register, handleSubmit } = useForm();

    const onSubmit = (data:any) => {

        let t: Task = {
            id: Date.now(),
            taskName: data.taskname,
            taskDescription: data.taskdescription,
            taskState: data.taskstate
        }

        taskManager.addTask(t) 

    }

    

    return <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
            <label htmlFor="taskname" className="form-label" >Nom de la tâche : </label>
            <input id="taskname" className="form-control" type="text" {...register('taskname')} defaultValue={task ? task.taskName : " "} />
        </div>
        <div className="mb-3">
            <label htmlFor="taskdescription" className="form-label">Description : </label>
            <textarea id="taskdescription" className="form-control" {...register("taskdescription")}></textarea>
        </div>
        <div className="mb-3">
            <label htmlFor="taskstate" className="form-label">Etat  : </label>
            <textarea id="taskstate" className="form-control" {...register("taskstate")}></textarea>
        </div>
        <div className="mb-3">
            <button type="submit">Enregistrer</button>
        </div>
    </form>
}   