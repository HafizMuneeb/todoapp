"use client";
import { Task } from '@/models/task';
import { useState, useEffect, FormEvent } from 'react';
import { remult, UserInfo } from 'remult';
import { TaskController } from './TaskController';
import {signIn, useSession, signOut} from 'next-auth/react';

const taskRepo = remult.repo(Task)

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const session = useSession()
  
  useEffect(() => {
    remult.user = session.data?.user as UserInfo
    if (session.status === "unauthenticated") signIn()
    else if (session.status === "authenticated")
      return taskRepo
        .liveQuery({
          orderBy: {
            createdAt: "asc",
          },
          where: {
            completed: undefined,
          },
        })
        .subscribe((info) => setTasks(info.applyChanges))
  }, [session])
  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle })
      setTasks([...tasks, newTask])
      setNewTaskTitle("")
    } catch (err: any) {
      alert(err.message)
    }
  }
  async function setCompleted(task: Task, completed: boolean) {
    const updatedTask = await taskRepo.save({ ...task, completed })
    setTasks(tasks.map((t) => (t == task ? updatedTask : t)))
  }
  async function deleteTask(task: Task) {
    try {
      await taskRepo.delete(task)
      setTasks(tasks.filter((t) => t !== task))
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function setAllCompleted(completed: boolean) {
    TaskController.setAllCompleted(completed)
  }
  if (session.status !== "authenticated") return <></>
  return (
    <div>
      <h1>Todos {tasks.length}</h1>
      <main>
        <div>
          <span>{remult.user?.name}</span>
          <button onClick={() => signOut()} className='btn-1'>Sign out</button>
        </div>
        {taskRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={addTask}>
            <input
              value={newTaskTitle}
              placeholder="What needs to be done?"
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button>Add</button>
          </form>
        )}
        {tasks.map((task) => {
          return (
            <div key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => setCompleted(task, e.target.checked)}
              />
              <span>{task.title}</span>
              <button onClick={() => deleteTask(task)} className='btnn'>Delete</button>
            </div>
          )
        })}
        <div>
          <button onClick={() => setAllCompleted(true)} className='btn'>
            Set all Completed
          </button>
          <button onClick={() => setAllCompleted(false)} className='btn'>
            Set all UnCompleted
          </button>
        </div>
      </main>
    </div>
  )
}