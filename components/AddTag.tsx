import React, { useState } from 'react'
import { TagIcon } from 'lucide-react'
import useTasksData from '../hooks/useTasksData'
import { TaskInterface } from '../types/task'

const AddTag = ({task, father}: {task: TaskInterface, father: TaskInterface}) => {

    const useTask = useTasksData()

    const [newTag, setNewTag] = useState('')

    return (
        <div className='relative flex flex-grow items-stretch focus-within:z-10'>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <TagIcon className='w-4 h-4' />
            </div>
            <input onChange={(e) => setNewTag(e.target.value)} type="text" placeholder='tag' className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
            <button
                type="button"
                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold bg-gray-900 text-gray-100 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:text-gray-900"
                onClick={async () => await useTask.add_tag(task, newTag, father)}
            >+</button>
        </div>
    )
}

export default AddTag