'use client'

import { useState } from "react"
import { TaskInterface } from "../types/task"

const useFilter  = () => {
    const [notChecked, setNotChecked] = useState(false)
    const [priorityOrder, setPriorityOrder] = useState(false)
    const [tags, setTags] = useState([])
    const [priority, setPriority] = useState([])

    const filterTaskArray = (baseTaskArray: TaskInterface[]): TaskInterface[] => {

        let updatedTasks = baseTaskArray

        if(notChecked){
            updatedTasks = updatedTasks.filter(task => !task.completed)
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