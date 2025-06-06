'use client'

import { TaskInterface, TaskProps } from "../types/task";
import { useDispatch } from "react-redux";
import { addTask, deleteTask, toggleTask, updateTask } from "../store/reducers/data";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";

const useTasksData = () => {   

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);

    const add_task = async (task: TaskProps, father?: TaskInterface) => {
        try {
            setLoading(true);
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    task: {...task, customId: uuidv4()},
                    father: father
                }),
            });

            if (!res.ok) throw new Error("Erro ao criar tarefa");

            const newTask = await res.json();
            console.log("Nova tarefa adicionada:", newTask);
            dispatch(addTask({ task: newTask, father }));
            setLoading(false);
        } catch (err) {
            console.error("Erro ao adicionar tarefa:", err);
        }
    };

    const update_task = async (task: TaskInterface, father?: TaskInterface) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/tasks/${task.customId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    task: task,
                    father: father
                }),
            });

            if (!res.ok) throw new Error("Erro ao atualizar tarefa");

            const updated = await res.json();
            console.log("Tarefa atualizada:", updated);
            dispatch(updateTask({ task: updated, father }));
            setLoading(false);
        } catch (err) {
            console.error("Erro ao atualizar tarefa:", err);
        }
    };

    const delete_task = async (task: TaskInterface, father?: TaskInterface) => {
        console.log("Deleting task:", task, "Father:", father ? father.customId : "None");
        try {
            setLoading(true);
            const res = await fetch(`/api/tasks/${task.customId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    father: father
                }),
            });

            if (!res.ok) throw new Error("Erro ao deletar tarefa");

            dispatch(deleteTask({ task, father }));
            setLoading(false);
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

    return { add_task, update_task, delete_task, add_tag, delete_tag, toggle_task, setLoading, loading };
};

export default useTasksData;