'use client'

import React, { SetStateAction, useEffect, useState } from 'react'
import { TaskInterface } from '../types/task'
import useTasksData from '../hooks/useTasksData'
import AddTaskInput from './AddTaskInput'
import { ChevronDown, ChevronUp, TagIcon, Trash2Icon } from 'lucide-react'
import { tags_imgs } from '../consts/tags'

const Task = ({task, setCurrentTask, father} : {task: TaskInterface, setCurrentTask: React.Dispatch<SetStateAction<{task: TaskInterface, father: TaskInterface}>>, father?: TaskInterface}) => {

    const useTask = useTasksData()

    const [newTag, setNewTag] = useState("")
    const [showAddTagInput, setShowAddTagInput] = useState(false)
    const [showChildren, setShowChildren] = useState(false)
    const [showDescription, setShowDescription] = useState(false)
    const [newTask, setNewTask] = useState<TaskInterface>(task)
    const [showSaveButton, setShowSaveButton] = useState(false)

    useEffect(() => {
        setCurrentTask({task, father})
    }, [task])

    return (
        <div onClick={() => setCurrentTask({task, father})} className={`mb-2 ${task.completed ? 'opacity-25' : ''}`}>
            <div className="flex text-gray-900 w-full">
                <div className='w-full'>
                    <div className='flex'>
                        <div>
                            <button onClick={() => setShowAddTagInput(!showAddTagInput)} className={`${showAddTagInput ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'} h-full px-1 rounded-l-md`}>+</button>
                        </div>
                        <div className="shadow-sm ring-1 ring-inset ring-gray-300 rounded-r-md flex justify-between w-full h-fit">
                            <input
                                id="select-all"
                                name="select-all"
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => useTask.toggle_task(task, father)}
                                className="h-4 w-4 my-auto ml-4 mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <div className='w-full my-2'>
                                <div className='flex'>
                                    {/* <button onClick={() => setShowDescription(!showDescription)}>
                                        {showDescription ? <ChevronUp className='w-4 h-4'/> : <ChevronDown className='w-4 h-4'/>}
                                    </button> */}
                                    <input
                                        type="text"
                                        className="text-sm w-full bg-transparent flex border-0 focus:outline-none px-1 py-0"
                                        value={newTask.title}
                                        onChange={(e) => {
                                            setNewTask({...task, title: e.target.value})
                                            setShowSaveButton(true)
                                        }}
                                    />
                                </div>
                                {/* <textarea
                                    className={`text-xs text-gray-400 bg-transparent w-full flex border-0 focus:outline-none resize-none h-5 px-1 py-0 ${showDescription ? 'block' : 'hidden'}`}
                                    value={newTask.description}
                                    onChange={(e) => {
                                        setNewTask({...task, description: e.target.value})
                                        setShowSaveButton(true)
                                    }}
                                /> */}
                            </div>
                        <div className={`${showSaveButton ? 'block' : 'hidden'} flex items-center gap-1 text-sm m-2 px-1 border-[1px] border-gray-900 rounded-md hover:bg-gray-100`}>
                            <button onClick={() => {
                                console.log(newTask)
                                useTask.update_task(newTask, father)
                            }}>Salvar</button>
                            <button onClick={() => setShowSaveButton(false)} type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20">
                                    <span className="sr-only">Remove</span>
                                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75">
                                        <path d="M4 4l6 6m0-6l-6 6" />
                                    </svg>
                                    <span className="absolute -inset-1" />
                                </button>
                        </div>
                        <div className='flex mr-4 gap-2'>
                            <button onClick={() => useTask.delete_task(task, father)} className="my-auto"><Trash2Icon className='h-[14px] w-[14px]'/></button>
                            <button onClick={() => {
                                    setShowChildren(!showChildren)
                                    setShowDescription(!showDescription)
                                }}>
                                {task.child ? showChildren ? (
                                    <ChevronUp className={`w-4 h-4`}/>
                                ) : (
                                    <ChevronDown className={`w-4 h-4`}/>
                                ) : null}
                            </button>
                        </div>
                    </div>
                    <div className={`ml-2 relative flex flex-grow items-stretch focus-within:z-10 ${showAddTagInput ? 'flex' : 'hidden'}`}>
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
                    </div>
                    <div className={showAddTagInput ? '' : 'hidden'}>
                        <AddTaskInput father={task} tags={task.tags}/>
                    </div>
                </div>
                <div className="gap-2 flex flex-col">
                    {/* {task.tags.map((tag, index) => (
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
                    ))} */}
                    <div className='flex gap-1'>
                        {task.tags.map((tag, i) => (
                            <div key={i}>
                                {tags_imgs[tag] ? (
                                    <div>
                                        <img className='h-9 w-9 object-cover rounded-md ml-2 cursor-pointer hover:opacity-50' src={tags_imgs[tag]} alt="tag image" onClick={() => useTask.delete_tag(task, tag, father)}/>
                                    </div>
                                ) : <div>{tag}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showChildren && task.child?.map((child, item) => (
                <div className='ml-16 mt-2' key={item}>
                    <Task setCurrentTask={setCurrentTask} task={child} father={task}/>
                </div>
            ))}
        </div>
    )
}

export default Task