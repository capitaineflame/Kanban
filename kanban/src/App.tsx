import './App.css'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskManager from './Class/TaskManager'
import Task from './interface'



function App() {



    const [task, setTask] = useState({
        id: 0, taskName: "", taskDescription: "", taskState:1, index : 0
    })

    const [data, setData] = useState([])
    const taskList: Task[] = []

    const taskManager = new TaskManager()

    //rÈcupÈration de la promesse HTTP
    async function getTasks() {
        try {
            const res = await fetch('http://localhost:8888/tasklist')
            const data = await res.json();
            setData(data)
        } catch (e) {
            console.error("l'erreur est ici", e)
        }
    }

    function getTaskById(idTask:number){
        taskList.filter(tasks => tasks.id == idTask).map(task => {
            let t: Task = task

            setTask(t)
            reset({
                id: task.id,
                taskName: task.taskName,
                taskDescription: task.taskDescription,
                taskState: task.taskState
            })
        })
    }

    //Parcours de la prommesse et injection dans le tableau des t‚ches
    function tabTransform() {
        for (let i = 0; i < data.length; i++) {
            taskList.push(data[i])
        }

        /*
        if (taskList.length == 0) {
            getTasks()
        }
        */
    }

    tabTransform()

    
    //FORMULAIRE
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            id: task.id,
            taskName: task.taskName,
            taskDescription: task.taskDescription,
            taskState : task.taskState
        }
    });

    

    const onSubmit = (data: any) => {

        let state:number = Number(data.taskState)

        let valId = data.id == 0 ? Date.now() : data.id

        let lastIndex: number = taskManager.getLastIndexByState(state, taskList)

        let index:number =  data.id == 0 ? lastIndex+1 : data.index

        let t: Task = {
            id: valId,
            taskName: data.taskName,
            taskDescription: data.taskDescription,
            taskState: state, 
            index : index
        }
        
        if (task.id != 0) { 
            console.log("update app")
            taskManager.updateTask(t, task)
        } else {
            taskManager.addTask(t)
        }

        getTasks()

    }

    function deleteTask(e: any) {
       
        let idTask: number = e.target.parentElement.parentElement.getAttribute("data-rbd-draggable-id")
        taskManager.deleteTask(idTask)
        getTasks()
    }

    function selectTask(e:any) {
        let idTask: number = e.target.parentElement.parentElement.getAttribute("data-rbd-draggable-id")
        getTaskById(idTask)
    }

    useEffect(() => {
        getTasks()
    }, [])

    const notify = (msg:string) => toast.error(msg);

    const dragNdrop = (results: any) => {

        console.log(results)

        let taskStateSource: number = results.source.droppableId
        let taskStateDestination: number = results.destination.droppableId

        let newIndex: number = results.destination.index

        let idTask = results.draggableId

        taskList.filter(tasks => tasks.id == idTask).map(task => {
            let t: Task = task

            setTask(t)
        })

        if (taskStateSource != taskStateDestination) {
            if (taskManager.verificationMove(taskStateDestination, taskStateSource)) {

                let newTask: Task = {
                    id: task.id,
                    taskName: task.taskName,
                    taskDescription: task.taskDescription,
                    taskState: taskStateDestination,
                    index: newIndex
                }

                taskManager.updateTask(newTask, task)

                

                getTasks()
            } else {
                notify("D√©placement non autoris√©")
            }
           
        }
        clearForm()
    }

    const identifyTask = (results: any) => {
        let idTask = results.draggableId

        taskList.filter(tasks => tasks.id == idTask).map(task => {
            let t: Task = task
            setTask(t)
        })
    }

    function clearForm() {
        reset({
            id: 0,
            taskName:"",
            taskDescription: "",
            taskState: 1
        })

        setTask({
            id: 0, taskName: "", taskDescription: "", taskState: 0, index : 0
        })
    }

    return <>
        <div className="container">
            <div>
                <ToastContainer position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    theme="dark" />
            </div>
            
            <div className="row align-items-start">
                <div className="col-3">
                    <h4>{task.id != 0 ? "Modification de t√¢che" : "Ajout d'une t√¢che"}</h4>
                    <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <input id="id" className="form-control" type="hidden" {...register('id')} />
                            </div>
                            <div className="mb-3">
                                    <label htmlFor="taskname" className="form-label" >Nom de la t√¢che : </label>
                                    <input id="taskname" className="form-control" type="text" {...register('taskName', { required: "Veuillez entrer le nom de la t‚che" })}  />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="taskdescription" className="form-label ">Description : </label>
                                <textarea id="taskdescription" className="form-control text-area-description" {...register("taskDescription")} ></textarea>
                            </div>
                                <div className="mb-3">
                                    <input id="taskstate" className="form-control" type="hidden" {...register("taskState")} />
                                </div>
                                <div className="mb-3">
                                    <div className="row">
                                        <div className="col-6">
                                            <button type="submit">Enregistrer</button>
                                        </div>
                                        <div className="col-6">
                                            <button type="button" className="width100" onClick={clearForm}>Annuler</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <DragDropContext onDragEnd={dragNdrop} onBeforeDragStart={identifyTask}>
                    <div className="col-3 text-center">
                            <div className="alert text-bg-light">To do </div>
                            <Droppable droppableId="1" type="group">
                                {(provided) => (
                                <div className="container" {...provided.droppableProps} ref={provided.innerRef}>
                                        {taskList.filter(tasks => tasks.taskState == 1).map((task, index) => (
                                            <Draggable draggableId={""+task.id} key={task.id} index={index}>
                                                {(provided) => (
                                                    
                                                    <div className="card" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                        <div className="card-body">
                                                        <h6 className="card-title">{task.taskName}</h6>
                                                        <a className="card-link" onClick={deleteTask}>Supprimer</a>
                                                        <a className="card-link" onClick={selectTask}>Modifier</a>
                                                        </div>
                                                    </div>
                                                )} 
                                   
                                    </Draggable>
                                    ))}
                                </div>
                            )}
                            </Droppable>
                  
                    </div>

                    <div className="col-3 text-center">
                   
                        <div className="alert text-bg-warning">To do </div>
                        <Droppable droppableId="2" type="group">
                            {(provided) => (
                                <div className="container" {...provided.droppableProps} ref={provided.innerRef}>
                                    {taskList.filter(tasks => tasks.taskState == 2).map((task, index) => (
                                        <Draggable draggableId={"" + task.id} key={task.id} index={index}>
                                            {(provided) => (
                                                <div className="card" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                    <div className="card-body">
                                                        <h6 className="card-title">{task.taskName}</h6>
                                                        <a className="card-link" onClick={deleteTask}>Supprimer</a>
                                                        <a className="card-link" onClick={selectTask}>Modifier</a>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    </div>
                
                    <div className="col-3 text-center">

                        <div className="alert text-bg-success">To do </div>
                        <Droppable droppableId="3" type="group">
                            {(provided) => (
                                <div className="container" {...provided.droppableProps} ref={provided.innerRef}>
                                    {taskList.filter(tasks => tasks.taskState == 3).map((task, index) => (
                                        <Draggable draggableId={"" + task.id} key={task.id} index={index}>
                                            {(provided) => (
                                                <div className="card" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                    <div className="card-body">
                                                        <h6 className="card-title">{task.taskName}</h6>
                                                        <a className="card-link" onClick={deleteTask}>Supprimer</a>
                                                        <a className="card-link" onClick={selectTask}>Modifier</a>
                                                    </div>
                                                </div>
                                            )}

                                        </Draggable>
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div >
        </div>
        
    </> 
}    
export default App