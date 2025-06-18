'use client'

import React, { useEffect, useState } from 'react'
import Task from '../components/Task'
import { TaskInterface } from '../types/task'
import Papa from 'papaparse'

const Import = () => {
    const [tasks, setTasks] = useState<TaskInterface[]>([])
    const [currentTask, setCurrentTask] = useState<{task: TaskInterface, father: TaskInterface | null} | null>(null)
    const [error, setError] = useState<string | null>(null)

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
            <div className="bg-white min-h-full m-1 md:m-4 w-full rounded-xl p-4 flex gap-4">
                <main className="flex-1">
                    <h1 className="text-2xl font-bold mb-4">Imported Tasks</h1>
                    {error ? (
                        <div className="text-red-500">{error}</div>
                    ) : tasks.length === 0 ? (
                        <div className="text-gray-500">No tasks found in CSV.</div>
                    ) : (
                        <div>
                            <div className="mb-4 text-sm text-gray-500">Found {tasks.length} root tasks</div>
                            {tasks.map((task, idx) => (
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