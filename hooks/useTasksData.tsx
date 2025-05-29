'use client'

import { TaskInterface, TaskProps } from "../types/task";
import { useDispatch } from "react-redux";
import { addTask, deleteTask, toggleTask, updateTask } from "../store/reducers/data";
import { v4 as uuidv4 } from 'uuid';

const useTasksData = () => {   

    const dispatch = useDispatch()

    const add_task = async (task: TaskProps, father?: TaskInterface) => {
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({...task, id: uuidv4()}),
            });

            if (!res.ok) throw new Error("Erro ao criar tarefa");

            const newTask = await res.json();
            dispatch(addTask({ task: newTask, father }));
        } catch (err) {
            console.error("Erro ao adicionar tarefa:", err);
        }
    };

    const update_task = async (task: TaskInterface, father?: TaskInterface) => {
        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });

            if (!res.ok) throw new Error("Erro ao atualizar tarefa");

            const updated = await res.json();
            dispatch(updateTask({ task: updated, father }));
        } catch (err) {
            console.error("Erro ao atualizar tarefa:", err);
        }
    };

    const delete_task = async (task: TaskInterface, father?: TaskInterface) => {
        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Erro ao deletar tarefa");

            dispatch(deleteTask({ task, father }));
        } catch (err) {
            console.error("Erro ao deletar tarefa:", err);
        }
    };

    const add_tag = (task: TaskInterface, tag: string, father?: TaskInterface) => {
        const updatedTask = { ...task, tags: [...(task.tags || []), tag] };
        update_task(updatedTask, father);
    };

    const delete_tag = (task: TaskInterface, tag: string, father?: TaskInterface) => {
        const updatedTask = { ...task, tags: (task.tags || []).filter(t => t !== tag) };
        update_task(updatedTask, father);
    };

    const toggle_task = (task: TaskInterface, father?: TaskInterface) => {
        const updatedTask = { ...task, completed: !task.completed };
        update_task(updatedTask, father);
    };

    return { add_task, update_task, delete_task, add_tag, delete_tag, toggle_task };
};

export default useTasksData;