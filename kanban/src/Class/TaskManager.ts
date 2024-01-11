const default_path = "http://localhost:8888"

import Task from './../interface'


export default class TaskManager {

    private tasks:Task[] = []


    async addTask(task: Task) {

        console.log(task)

        await fetch(default_path+'/tasklist', {
            method: 'POST',
            body: JSON.stringify(task)
        })
    }

    async deleteTask(idTask: number) {
        await fetch(default_path + '/deleteTask', {
            method: 'POST',
            body: JSON.stringify({"id":idTask})
        })
    }

    async updateTask(newTask: Task, oldTask: Task) {

        if (this.verificationMove(newTask.taskState, oldTask.taskState)) {
            await fetch(default_path + '/updateTask', {
                method: 'POST',
                body: JSON.stringify(newTask)
            })
        } else {
            console.log("Impossible de modifier cette tache")
        }

    }

    public  verificationMove(newState: number, oldState: number): boolean {
        if (newState > 3 || newState < 1) return false;

        let diff = newState - oldState

        if (diff != 1 && diff != -1 && diff != 0) return false

        return true
    }


    public getLastIndexByState(state: number, tasks: Task[]): number {

        let index:number = 0

        let tasksCopy: Task[] = tasks.filter(task => task.taskState == state)

        if (tasksCopy.length > 0) {
            tasksCopy.map(t => {
                if (t.index > index) index = t.index
            })
        }

        return index
    }
}

