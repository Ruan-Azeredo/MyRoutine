'use client'

import { TaskInterface, TaskProps } from "../types/task";
import { useDispatch } from "react-redux";
import { addTask, deleteTask, updateTask } from "../store/reducers/data";

const useTasksData = () => {

    const dispatch = useDispatch()

    const add_task = (task: TaskProps, father?: TaskInterface) => {
        dispatch(addTask({task, father}))
    }

    const update_task = (task: TaskInterface, father?: TaskInterface) => {
        dispatch(updateTask({task, father}))
    }

    const delete_task = (task: TaskInterface, father?: TaskInterface) => {
        dispatch(deleteTask({task, father}))
    }

    const add_tag = (task: TaskInterface, tag: string, father?: TaskInterface) => {
        const updatedTask = { ...task, tags: [...task.tags, tag] };
        update_task(updatedTask, father);
    }

    const delete_tag = (task: TaskInterface, tag: string, father?: TaskInterface) => {
        const updatedTask = { ...task, tags: task.tags.filter(t => t !== tag) };
        update_task(updatedTask, father);
    }

    const toggle_task = (task: TaskInterface, father?: TaskInterface) => {
        const updatedTask = { ...task, completed: !task.completed };
        update_task(updatedTask, father);
    }

    return { add_task, update_task, delete_task, add_tag, delete_tag, toggle_task }
}

export default useTasksData