'use client'

import React, { useState } from 'react'
import { TaskInterface } from '../types/task'
import useTasksData from '../hooks/useTasksData'
import AddTaskInput from './AddTaskInput'
import { ChevronDown, ChevronUp, TagIcon, Trash2Icon } from 'lucide-react'

const Task = ({task, father} : {task: TaskInterface, father?: TaskInterface}) => {

    const useTask = useTasksData()

    const [newTag, setNewTag] = useState("")
    const [showAddTagInput, setShowAddTagInput] = useState(false)
    const [showChildren, setShowChildren] = useState(true)

    console.log(task.child)

    return (
        <div className='mb-3'>
            <div className="flex text-gray-900 w-full">
                <div>
                    <button onClick={() => setShowAddTagInput(!showAddTagInput)} className='bg-gray-900 text-gray-100 h-8 mt-2 px-1 rounded-l-md'>+</button>
                </div>
                <div className='w-full'>
                    <div className="shadow-sm ring-1 ring-inset ring-gray-300 rounded-md flex justify-between w-full h-fit">
                        <input
                            id="select-all"
                            name="select-all"
                            type="checkbox"
                            onChange={() => useTask.toggle_task(task, father)}
                            className="h-4 w-4 my-auto ml-4 mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <div className='w-full my-2'>
                            <input
                                type="text"
                                className="text-sm bg-transparent w-full flex border-0 focus:outline-none px-1 py-0"
                                value={task.title}
                                onChange={(e) => useTask.update_task({...task, title: e.target.value}, father)}
                            />
                            <textarea
                                className="text-xs text-gray-400 bg-transparent w-full flex border-0 focus:outline-none resize-none h-5 px-1 py-0"
                                value={task.description}
                                onChange={(e) => useTask.update_task({...task, description: e.target.value}, father)}
                            />
                        </div>
                        <div className='flex mr-4 gap-2'>
                            <button onClick={() => useTask.delete_task(task, father)} className="my-auto"><Trash2Icon className='h-[14px] w-[14px]'/></button>
                            <button className={task.child?.length > 0 ? 'block' : 'hidden'} onClick={() => setShowChildren(!showChildren)}>
                                {showChildren ? <ChevronUp className='w-4 h-4'/> : <ChevronDown className='w-4 h-4'/>}
                            </button>
                        </div>
                    </div>
                    <div className={`mt-2 relative flex flex-grow items-stretch focus-within:z-10 ${showAddTagInput ? 'flex' : 'hidden'}`}>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <TagIcon className='w-4 h-4' />
                        </div>
                        <input onChange={(e) => setNewTag(e.target.value)} type="text" placeholder='tag' className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        <button
                            type="button"
                            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold bg-gray-900 text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => useTask.add_tag(task, newTag, father)}
                        >+</button>
                    </div>
                    <div className={showAddTagInput ? '' : 'hidden'}>
                        <AddTaskInput father={task} />
                    </div>
                </div>
                <div className="gap-2 flex flex-col ml-2">
                    {task.tags.map((tag, index) => (
                        <div className='flex gap-1' key={index}>
                            <span className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                {tag}
                                <button onClick={() => useTask.delete_tag(task, tag, father)} type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20">
                                    <span className="sr-only">Remove</span>
                                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75">
                                        <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            {showChildren && task.child?.map((child, item) => (
                <div className='ml-16 mt-1' key={item}>
                    <Task task={child} father={task}/>
                </div>
            ))}
        </div>
    )
}

export default Task