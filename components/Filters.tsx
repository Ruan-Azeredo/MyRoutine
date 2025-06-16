import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { filterDisplayTasks } from "../store/reducers/data";
import { tags_imgs } from "../consts/tags";
import { ChevronDownIcon, ChevronsDownIcon, ChevronsUpIcon, ChevronUpIcon, EqualIcon } from "lucide-react";

export default function Filters(){
    const tasks = useAppSelector((state) => state.data.tasks)

    const dispatch = useDispatch()

    const [notChecked, setNotChecked] = useState(false)
    const [priorityOrder, setPriorityOrder] = useState(false)
    const [tags, setTags] = useState([])
    const [priority, setPriority] = useState([])


    const tags_array = Object.entries(tags_imgs)

    useEffect(() => {
        let updatedTasks = tasks

        if(notChecked){
            updatedTasks = updatedTasks.filter(task => !task.completed)
        }
        if(priorityOrder){
            console.log(updatedTasks)
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

        dispatch(filterDisplayTasks(updatedTasks))
    }, [notChecked, priorityOrder, tags, priority])

    const PriorityIcon = ({ pri }: { pri: string }) => {
        switch (pri) {
            case '5':
                return <ChevronsUpIcon className={`w-6 h-6 text-red-500`} onClick={() => setPriority(priority.filter(f => f !== pri))}/>
            case '4':
                return <ChevronUpIcon className={`w-6 h-6 text-orange-500`} onClick={() => setPriority(priority.filter(f => f !== pri))}/>
            case '3':
                return <EqualIcon className={`w-6 h-6 text-yellow-500`} onClick={() => setPriority(priority.filter(f => f !== pri))}/>
            case '2':
                return <ChevronDownIcon className={`w-6 h-6 text-green-500`} onClick={() => setPriority(priority.filter(f => f !== pri))}/>
            case '1':
                return <ChevronsDownIcon className={`w-6 h-6 text-blue-500`} onClick={() => setPriority(priority.filter(f => f !== pri))}/>
            default:
                return null
        }
    };

    return (
        <div className="flex w-full py-2 gap-2">
            <button className={`${notChecked ? 'bg-gray-900' : 'text-gray-900 border-[1px] border-gray-900'} py-2 px-4 rounded-md text-xs`} onClick={() => setNotChecked((n) => !n)}>Not Checked</button>

            <button className={`${priorityOrder ? 'bg-gray-900' : 'text-gray-900 border-[1px] border-gray-900'} py-2 px-4 rounded-md text-xs`} onClick={() => setPriorityOrder((p) => !p)}>Priority Order</button>
            
            <div className="flex">
                <select value='Tag' className="rounded-md border-gray-900 text-gray-900 text-xs" name="Tags" onChange={(e) => {
                        setTags([...tags, e.target.value])
                    }}>
                    <option value="Tag" disabled>Tag</option>
                    {tags_array.map(([tag, _]) => (
                        <option value={tag} key={tag}>{tag}</option>
                    ))}
                </select>
                {tags_array.map(([tag, img]) => (
                    <div key={tag} className={tags.includes(tag) ? 'flex' : 'hidden'}>
                        <img className='h-8 w-8 object-cover rounded-md ml-2 cursor-pointer hover:opacity-50' src={img} alt="tag image" onClick={() => {
                            setTags(tags.filter(f => f !== tag))
                        }}/>
                    </div>
                ))}
            </div>

            <div className="flex">
                <select value='Priority' className="rounded-md border-gray-900 text-gray-900 text-xs" name="Priority" onChange={(e) => {
                        setPriority([...priority, e.target.value])
                    }}>
                    <option value="Priority" disabled>Priority</option>
                    {['1', '2', '3', '4', '5'].map((pri) => (
                        <option value={pri} key={pri}>{pri}</option>
                    ))}
                </select>
                {['1', '2', '3', '4', '5'].map((pri) => (
                    <div key={pri} className={priority.includes(pri) ? 'flex my-auto ml-2' : 'hidden'}>
                        <PriorityIcon pri={pri} />
                    </div>
                ))}
            </div>

        </div>
    )
}