import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TaskInterface, TaskProps } from "../../types/task"
import { v4 as uuidv4 } from 'uuid';

interface DataState {
    tasks: TaskInterface[]
}

const initialState: DataState = {
    tasks: [
        {   
            id: uuidv4(),
            title: 'Assinar contrato Talqui',
            description: 'https://mail.google.com/mail/u/0/?ogbl#inbox',
            date: null,
            completed_date: null,
            completed: false,
            tags: ['talqui'],
            priority: null,
            child: [{
                id: uuidv4(),
                title: 'verificar email',
                description: 'https://mail.google.com/mail/u/0/?ogbl#inbox',
                date: null,
                completed_date: null,
                completed: false,
                tags: ['talqui'],
                priority: null,
                child: null
            }]
        }
    ]
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<TaskInterface[]>) => {
            state.tasks = action.payload
        },
        addTask: (state, action: PayloadAction<{task: TaskProps, father?: TaskInterface}>) => {
            const task: TaskInterface = { ...action.payload.task, id: uuidv4() }
            if (action.payload.father) {
                const addChildTask = (tasks: TaskInterface[], fatherId: string, taskToAdd: TaskInterface): boolean => {
                    for (const task of tasks) {
                        if (task.id === fatherId) {
                            task.child = [...(task.child || []), taskToAdd];
                            return true;
                        }
                        if (task.child && addChildTask(task.child, fatherId, taskToAdd)) {
                            return true;
                        }
                    }
                    return false;
                };

                addChildTask(state.tasks, action.payload.father.id, task);
            } else {
                state.tasks.push(task)
            }
        },
        deleteTask: (state, action: PayloadAction<{task: TaskInterface, father?: TaskInterface}>) => {
            if (action.payload.father) {
                const removeChildTask = (tasks: TaskInterface[], fatherId: string, taskIdToRemove: string): boolean => {
                    for (const task of tasks) {
                        if (task.id === fatherId) {
                            task.child = task.child?.filter(child => child.id !== taskIdToRemove) || [];
                            return true;
                        }
                        if (task.child && removeChildTask(task.child, fatherId, taskIdToRemove)) {
                            return true;
                        }
                    }
                    return false;
                };

                removeChildTask(state.tasks, action.payload.father.id, action.payload.task.id);
            } else {
                state.tasks = state.tasks.filter(task => task.id !== action.payload.task.id)
            }
        },
        updateTask: (state, action: PayloadAction<{task: TaskInterface, father?: TaskInterface}>) => {
            if (action.payload.father) {
                const updateChildTask = (tasks: TaskInterface[], fatherId: string, taskToUpdate: TaskInterface): boolean => {
                    for (const task of tasks) {
                        if (task.id === fatherId) {
                            const childIndex = task.child?.findIndex(child => child.id === taskToUpdate.id);
                            if (childIndex !== undefined && childIndex !== -1) {
                                task.child![childIndex] = taskToUpdate;
                                return true;
                            }
                        }
                        if (task.child && updateChildTask(task.child, fatherId, taskToUpdate)) {
                            return true;
                        }
                    }
                    return false;
                };

                updateChildTask(state.tasks, action.payload.father.id, action.payload.task);
            } else {
                const taskIndex = state.tasks.findIndex(task => task.id === action.payload.task.id)
                if (taskIndex !== -1) {
                    state.tasks[taskIndex] = action.payload.task
                }
            }
        },
        toggleTask: (state, action: PayloadAction<{task: TaskInterface, father?: TaskInterface}>) => {
            dataSlice.caseReducers.updateTask(state, {
                payload: {
                    task: action.payload.task,
                    father: action.payload.father
                },
                type: 'data/updateTask'
            })
            // put task in the end f the array
            // const taskIndex = state.tasks.findIndex(task => task.id === action.payload.task.id)
            // if (taskIndex !== -1) {
            //     const [task] = state.tasks.splice(taskIndex, 1);
            //     state.tasks.push(task);
            // }
        },
        searchTasks: (state, action: PayloadAction<string>) => {
            if(action.payload.trim() === '') {
                state.tasks = initialState.tasks
                return;
            }
            const searchTerm = action.payload.toLowerCase()
            state.tasks = state.tasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm) || 
                (task.description && task.description.toLowerCase().includes(searchTerm)) ||
                (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            )
        }
    }
})

export const { setTasks, addTask, deleteTask, updateTask, toggleTask, searchTasks } = dataSlice.actions
export default dataSlice.reducer