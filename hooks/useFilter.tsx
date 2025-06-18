'use client'

import { useState } from "react"
import { TaskInterface } from "../types/task"

const useFilter  = () => {
    const [notChecked, setNotChecked] = useState(true)
    const [priorityOrder, setPriorityOrder] = useState(true)
    const [tags, setTags] = useState([])
    const [priority, setPriority] = useState([])

    const filterTaskArray = (baseTaskArray: TaskInterface[]): TaskInterface[] => {
        // Helper function to apply filters to a single task and its children
        const applyFiltersToTask = (task: TaskInterface): TaskInterface => {
            // Create a copy of the task to avoid mutating the original
            const filteredTask = { ...task }
            
            // Apply filters to children if they exist
            if (filteredTask.child && filteredTask.child.length > 0) {
                filteredTask.child = filterTaskArray(filteredTask.child)
            }
            
            return filteredTask
        }

        let updatedTasks = baseTaskArray.map(applyFiltersToTask)

        if(notChecked){
            updatedTasks = updatedTasks.filter(task => !task.completed)
            console.log('notChecked', updatedTasks)
        }
        if(priorityOrder){
            updatedTasks = [...updatedTasks].sort((a, b) => (b.priority || 0) - (a.priority || 0))
        }
        if(tags.length > 0){
            updatedTasks = tags.reduce((acc, tag) => {
                const filtered = updatedTasks.filter(task => task.tags?.includes(tag))
                return acc.concat(filtered)
            }, [])
        }
        if(priority.length > 0){
            updatedTasks = priority.reduce((acc, priority) => {
                const filtered = updatedTasks.filter(task => task.priority == priority)
                console.log(filtered)
                return acc.concat(filtered)
            }, [])
        }

        return updatedTasks
    }

    return {
        notChecked, setNotChecked,
        priorityOrder, setPriorityOrder,
        tags, setTags,
        priority, setPriority,
        filterTaskArray
    }
}

export default useFilter