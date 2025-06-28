'use client'

import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { filterDisplayTasks } from "../store/reducers/data";
import { tags_imgs } from "../consts/tags";
import { ChevronDownIcon, ChevronsDownIcon, ChevronsUpIcon, ChevronUpIcon, EqualIcon } from "lucide-react";
import useFilter from "../hooks/useFilter";

export default function Filters(){
    const tasks = useAppSelector((state) => state.data.tasks)

    const dispatch = useDispatch()

    const filter = useFilter()

    const tags_array = Object.entries(tags_imgs)

    useEffect(() => {
        let updatedTasks = filter.filterTaskArray(tasks)

        dispatch(filterDisplayTasks(updatedTasks))
    }, [filter.notChecked, filter.priorityOrder, filter.tags, filter.priority])

    const PriorityIcon = ({ pri }: { pri: string }) => {
        switch (pri) {
            case '5':
                return <ChevronsUpIcon className={`w-6 h-6 text-red-500`} onClick={() => filter.setPriority(filter.priority.filter(f => f !== pri))}/>
            case '4':
                return <ChevronUpIcon className={`w-6 h-6 text-orange-500`} onClick={() => filter.setPriority(filter.priority.filter(f => f !== pri))}/>
            case '3':
                return <EqualIcon className={`w-6 h-6 text-yellow-500`} onClick={() => filter.setPriority(filter.priority.filter(f => f !== pri))}/>
            case '2':
                return <ChevronDownIcon className={`w-6 h-6 text-green-500`} onClick={() => filter.setPriority(filter.priority.filter(f => f !== pri))}/>
            case '1':
                return <ChevronsDownIcon className={`w-6 h-6 text-blue-500`} onClick={() => filter.setPriority(filter.priority.filter(f => f !== pri))}/>
            default:
                return null
        }
    };

    return (
        <div className="flex w-full py-2 gap-2">
            <button className={`${filter.notChecked ? 'bg-gray-900' : 'text-gray-900 border-[1px] border-gray-900'} md:py-2 py-1 md:px-4 px-2 rounded-md text-xs text-nowrap`} onClick={() => filter.setNotChecked(!filter.notChecked)}>Not Checked</button>

            <button className={`${filter.priorityOrder ? 'bg-gray-900' : 'text-gray-900 border-[1px] border-gray-900'} md:py-2 py-1 md:px-4 px-2 rounded-md text-xs text-nowrap`} onClick={() => filter.setPriorityOrder((p) => !p)}>Priority Order</button>
            <div className="flex md:flex-row flex-col">
                <select value='Tag' className="rounded-md border-gray-900 text-gray-900 text-xs max-w-[76px]" name="Tags" onChange={(e) => {
                        filter.setTags([...filter.tags, e.target.value])
                    }}>
                    <option value="Tag" disabled>Tag</option>
                    {tags_array.map(([tag, _]) => (
                        <option value={tag} key={tag}>{tag}</option>
                    ))}
                </select>
                {tags_array.map(([tag, img]) => (
                    <div key={tag} className={filter.tags.includes(tag) ? 'flex' : 'hidden'}>
                        <img className='h-8 w-8 object-cover rounded-md ml-2 cursor-pointer hover:opacity-50' src={img} alt="tag image" onClick={() => {
                            filter.setTags(filter.tags.filter(f => f !== tag))
                        }}/>
                    </div>
                ))}
            </div>

            <div className="flex md:flex-row flex-col">
                <select value='Priority' className="rounded-md border-gray-900 text-gray-900 text-xs" name="Priority" onChange={(e) => {
                        filter.setPriority([...filter.priority, e.target.value])
                    }}>
                    <option value="Priority" disabled>Priority</option>
                    {['1', '2', '3', '4', '5'].map((pri) => (
                        <option value={pri} key={pri}>{pri}</option>
                    ))}
                </select>
                {['1', '2', '3', '4', '5'].map((pri) => (
                    <div key={pri} className={filter.priority.includes(pri) ? 'flex my-auto ml-2' : 'hidden'}>
                        <PriorityIcon pri={pri} />
                    </div>
                ))}
            </div>

        </div>
    )
}