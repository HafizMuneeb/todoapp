import { Task } from "@/models/task"
import { Allow,BackendMethod, remult } from "remult"

export class TaskController{
    @BackendMethod({allowed: Allow.authenticated})
    static async setAllCompleted(completed:boolean){
        const taskRepo = remult.repo(Task)
        for (const task of await taskRepo.find()) {
            await taskRepo.save({...task, completed})
        }
      }
}