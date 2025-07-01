/* eslint-disable @next/next/no-img-element */
'use client'

import React, { SetStateAction, useEffect, useState } from 'react'
import { TaskInterface } from '../types/task'
import useTasksData from '../hooks/useTasksData'
import AddTaskInput from './AddTaskInput'
import { ChevronDown, ChevronDownIcon, ChevronsDownIcon, ChevronsUpIcon, ChevronUp, ChevronUpIcon, EllipsisVerticalIcon, EqualIcon, MinusIcon, PlusIcon, TagIcon, Trash2Icon } from 'lucide-react'
import { tags_imgs, tags_list } from '../consts/tags'

const Task = ({task, setCurrentTask, father, openTag} : {task: TaskInterface, setCurrentTask: React.Dispatch<SetStateAction<{task: TaskInterface, father: TaskInterface}>>, father?: TaskInterface, openTag?: boolean}) => {

    const useTask = useTasksData()

    const [showChildren, setShowChildren] = useState(false)
    const [showDescription, setShowDescription] = useState(false)
    const [newTask, setNewTask] = useState<TaskInterface>()
    const [showSaveButton, setShowSaveButton] = useState(false)

    useEffect(() => {
        setNewTask(task)

    }, [task])

    const PriorityIcon = ({priority}: {priority: number}) => {
        switch (priority) {
            case 5:
                return <ChevronsUpIcon className={`w-4 h-4 text-red-500`} />
            case 4:
                return <ChevronUpIcon className={`w-4 h-4 text-orange-500`} />
            case 3:
                return <EqualIcon className={`w-4 h-4 text-yellow-500`} />
            case 2:
                return <ChevronDownIcon className={`w-4 h-4 text-green-500`} />
            case 1:
                return <ChevronsDownIcon className={`w-4 h-4 text-blue-500`} />
            default:
                return null
        }
    };

    return (
        <div className={`mb-2 ${task.completed ? 'opacity-25' : ''}`}>
            <div className=" text-gray-900 w-full">
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
                    <div className="relative w-full">
                        <div className={`flex md:gap-1 absolute -top-[6px] md:-top-1 right-0 mr-1 md:mr-6 ${openTag ? 'block' : 'hidden'}`}>
                            {task.tags.map((tag, i) => (
                                <div key={i}>
                                    {tags_list.find(t => t.name.toLowerCase() === tag.toLowerCase()) ? (
                                        <div style={{backgroundColor: tags_list.find(t => t.name.toLowerCase() === tag.toLowerCase())?.color}} className={`flex gap-1 px-[2px] md:px-1 pt-[1px] pb-[1px] rounded-[4px] items-center ${task.tags.length > 1 ? 'ml-2' : ''}`}>
                                            <img className='h-3 w-3 object-cover rounded-md cursor-pointer hover:opacity-50' src={tags_list.find(t => t.name.toLowerCase() === tag.toLowerCase())?.image} alt="tag image" onClick={() => useTask.delete_tag(task, tag, father)}/>
                                            <span className='text-[10px] text-gray-100 hidden md:block'>{tag}</span>
                                        </div>
                                    ) : (
                                        <div className='flex gap-1 ml-2'>
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
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <div className='flex md:flex-row flex-col w-full'>
                        <div className='flex w-full'>
                           
                            <div className={`${openTag ? 'hidden' : 'flex rounded-l-md'} overflow-hidden`}>
                                {task.tags.map((tag, i) => (
                                    <div key={i} className={`h-full w-2 ${i > 0 ? 'ml-1' : ''}`} style={{backgroundColor: tags_list.find(t => t.name.toLowerCase() === tag.toLowerCase())?.color}}>
                                    </div>
                                ))}
                            </div>
                            <div className={`shadow-sm ring-1 ring-inset ring-gray-300 rounded-md flex justify-between w-full h-fit py-1 md:py-2 ${!openTag && task.tags.length > 0 ? 'rounded-l-none' : ''}`}>
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
                                            value={newTask?.title || task.title}
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
                                        setShowSaveButton(false)
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
                                    <div className='my-auto'>
                                        <PriorityIcon priority={task.priority}/>
                                    </div>
                                    <button onClick={() => useTask.delete_task(task, father)} className="my-auto"><Trash2Icon className='h-[14px] w-[14px]'/></button>
                                    <button onClick={() => {
                                            setShowChildren(!showChildren)
                                            setShowDescription(!showDescription)
                                        }}>
                                        {task.child && task.child.length > 0 ? showChildren ? (
                                            <ChevronUp className={`w-4 h-4`}/>
                                        ) : (
                                            <ChevronDown className={`w-4 h-4`}/>
                                        ) : null}
                                    </button>
                                    <button onClick={() => setCurrentTask({task, father})}><EllipsisVerticalIcon className='w-4 h-4'/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showChildren && task.child?.map((child, item) => (
                <div className='ml-4 md:ml-16 mt-2' key={item}>
                    <Task setCurrentTask={setCurrentTask} task={child} father={task} openTag={openTag}/>
                </div>
            ))}
        </div>
    )
}

export default Task