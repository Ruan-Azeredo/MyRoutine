'use client'

import React, { useEffect, useState } from 'react'
import Task from '../components/Task'
import { TaskInterface } from '../types/task'
import Papa from 'papaparse'
import useFilter from '../hooks/useFilter'
import { tags_imgs } from '../consts/tags'
import { ChevronDownIcon, ChevronsDownIcon, ChevronsUpIcon, ChevronUpIcon, EqualIcon } from 'lucide-react'

const ImportFilters = ({ filter }: { filter: ReturnType<typeof useFilter> }) => {
    const tags_array = Object.entries(tags_imgs)

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
    }

    return (
        <div className="flex w-full py-2 gap-2">
            <button 
                className={`${filter.notChecked ? 'bg-gray-900 text-white' : 'text-gray-900 border-[1px] border-gray-900'} md:py-2 py-1 md:px-4 px-2 rounded-md text-xs`} 
                onClick={() => filter.setNotChecked(!filter.notChecked)}
            >
                Not Checked
            </button>

            <button 
                className={`${filter.priorityOrder ? 'bg-gray-900 text-white' : 'text-gray-900 border-[1px] border-gray-900'} md:py-2 py-1 md:px-4 px-2 rounded-md text-xs`} 
                onClick={() => filter.setPriorityOrder(!filter.priorityOrder)}
            >
                Priority Order
            </button>

            <div className="flex md:flex-row flex-col">
                <select 
                    value='Tag' 
                    className="rounded-md border-gray-900 text-gray-900 text-xs max-w-[76px]" 
                    name="Tags" 
                    onChange={(e) => {
                        filter.setTags([...filter.tags, e.target.value])
                    }}
                >
                    <option value="Tag" disabled>Tag</option>
                    {tags_array.map(([tag, _]) => (
                        <option value={tag} key={tag}>{tag}</option>
                    ))}
                </select>
                {tags_array.map(([tag, img]) => (
                    <div key={tag} className={filter.tags.includes(tag) ? 'flex' : 'hidden'}>
                        <img 
                            className='h-8 w-8 object-cover rounded-md ml-2 cursor-pointer hover:opacity-50' 
                            src={img} 
                            alt="tag image" 
                            onClick={() => {
                                filter.setTags(filter.tags.filter(f => f !== tag))
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="flex md:flex-row flex-col">
                <select 
                    value='Priority' 
                    className="rounded-md border-gray-900 text-gray-900 text-xs" 
                    name="Priority" 
                    onChange={(e) => {
                        filter.setPriority([...filter.priority, e.target.value])
                    }}
                >
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

const Import = () => {
    const [tasks, setTasks] = useState<TaskInterface[]>([])
    const [filteredTasks, setFilteredTasks] = useState<TaskInterface[]>([])
    const [currentTask, setCurrentTask] = useState<{task: TaskInterface, father: TaskInterface | null} | null>(null)
    const [error, setError] = useState<string | null>(null)
    const filter = useFilter()

    // Apply filters whenever tasks or filter settings change
    useEffect(() => {
        if (tasks.length > 0) {
            const filtered = filter.filterTaskArray(tasks)
            setFilteredTasks(filtered)
            console.log('Filtered tasks:', filtered.length)
        }
    }, [tasks, filter.notChecked, filter.priorityOrder, filter.tags, filter.priority])

    useEffect(() => {
        const fetchCSV = async () => {
            try {
                const resp = await fetch('/backup.csv')
                const text = await resp.text()
                
                // Skip metadata headers
                const lines = text.split('\n')
                const dataStart = lines.findIndex(line => line.includes('"Folder Name"'))
                if (dataStart === -1) {
                    setError('Invalid CSV format')
                    return
                }

                // Get actual CSV content
                const csvContent = lines.slice(dataStart).join('\n')
                
                Papa.parse(csvContent, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        console.log('Parse results:', {
                            rows: results.data.length,
                            fields: results.meta.fields,
                            sample: results.data[0]
                        })
                        
                        const data = results.data as any[]
                        
                        // First, create all tasks without child relationships
                        const allTasks = data
                            .filter(row => {
                                return row['Title'] && typeof row['Title'] === 'string' && row['Title'].trim() !== ''
                            })
                            .map(row => {
                                const priority = row['Priority'] ? parseInt(row['Priority'], 10) : null
                                const status = row['Status'] ? row['Status'].toString() : '0'
                                
                                return {
                                    customId: row['taskId'] || Math.random().toString(36).slice(2),
                                    title: row['Title'].trim(),
                                    description: row['Content'] || null,
                                    date: row['Created Time'] ? new Date(row['Created Time']).getTime() : null,
                                    completed_date: row['Completed Time'] ? new Date(row['Completed Time']).getTime() : null,
                                    completed: status === '1' || status === '2',
                                    tags: row['Tags'] ? row['Tags'].split(',').map((t: string) => t.trim()).filter(Boolean) : [],
                                    priority: isNaN(priority) ? null : priority,
                                    child: [],
                                    parentId: row['parentId'] || null // Temporarily store parentId
                                }
                            })

                        // Create a map for quick task lookup
                        const taskMap = new Map(allTasks.map(task => [task.customId, task]))

                        // Build the tree structure
                        const rootTasks = allTasks.filter(task => {
                            if (task.parentId) {
                                // Add this task as a child to its parent
                                const parent = taskMap.get(task.parentId)
                                if (parent && parent.child) {
                                    parent.child.push(task)
                                    return false // This task is a child, not a root
                                }
                            }
                            return true // This is a root task
                        })

                        // Remove the temporary parentId field and sort children by date
                        const cleanTask = (task: any): TaskInterface => {
                            const { parentId, ...cleanedTask } = task
                            if (cleanedTask.child && cleanedTask.child.length > 0) {
                                cleanedTask.child = cleanedTask.child
                                    .map(cleanTask)
                                    .sort((a, b) => (b.date || 0) - (a.date || 0))
                            }
                            return cleanedTask
                        }

                        // Clean and sort root tasks
                        const finalTasks = rootTasks
                            .map(cleanTask)
                            .sort((a, b) => (b.date || 0) - (a.date || 0))

                        console.log('Mapped tasks:', finalTasks.length, 'First task:', finalTasks[0])
                        setTasks(finalTasks)
                        setFilteredTasks(finalTasks) // Initialize filtered tasks with all tasks
                    },
                    error: (error) => {
                        console.error('CSV Parse error:', error)
                        setError('Failed to parse CSV: ' + error.message)
                    }
                })
            } catch (err) {
                console.error('Fetch error:', err)
                setError('Failed to load CSV file')
            }
        }
        fetchCSV()
    }, [])

    return (
        <div className="mx-auto min-h-screen flex w-full">
            <div className="bg-white min-h-full m-1 md:m-4 w-full rounded-xl p-4 flex flex-col gap-4">
                <ImportFilters filter={filter} />
                <main className="flex-1">
                    <h1 className="text-2xl font-bold mb-4">Imported Tasks</h1>
                    {error ? (
                        <div className="text-red-500">{error}</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-gray-500">
                            {tasks.length === 0 ? 'No tasks found in CSV.' : 'No tasks match the current filters.'}
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4 text-sm text-gray-500">
                                Showing {filteredTasks.length} of {tasks.length} tasks
                            </div>
                            {filteredTasks.map((task, idx) => (
                                <Task key={task.customId + idx} task={task} setCurrentTask={setCurrentTask} father={undefined} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Import