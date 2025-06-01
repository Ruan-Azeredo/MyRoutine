'use client'

import React, { useState } from 'react'
import useTasksData from '../hooks/useTasksData'
import { TaskInterface } from '../types/task'
import { SquareCheckBigIcon } from 'lucide-react'

const AddTaskInput = ({father} : {father?: TaskInterface}) => {

    const taskData = useTasksData()

	const [newTask, setNewTask] = useState({
		title: "",
		description: null,
		date: null,
		completed_date: null,
		completed: false,
		tags: [],
		priority: null,
		child: null
	})

    return (
        <div className="">
            <div className="mt-2 flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SquareCheckBigIcon className='w-4 h-4 text-gray-900'/>
                    </div>
                    <input
                        id="text"
                        name="text"
                        type="text"
                        placeholder="task"
                        className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        value={newTask.title}
                    />
                </div>
                <button
                    type="button"
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => {
                        taskData.add_task(newTask, father)
                        setNewTask({
                            title: "",
                            description: null,
                            date: null,
                            completed_date: null,
                            completed: false,
                            tags: [],
                            priority: null,
                            child: null
                        })
                    }}
                >add</button>
            </div>
        </div>
    )
}

export default AddTaskInput