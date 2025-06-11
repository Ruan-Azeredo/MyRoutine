import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TaskInterface, TaskProps } from "../../types/task"
import { v4 as uucustomIdv4 } from 'uuid';

interface DataState {
    tasks: TaskInterface[]
    displayTasks: TaskInterface[]
}

const initialState: DataState = {
    tasks: [],
    displayTasks: []
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<TaskInterface[]>) => {
            state.tasks = action.payload
            state.displayTasks = action.payload
        },
        filterDisplayTasks: (state, action: PayloadAction<TaskInterface[]>) => {
            state.displayTasks = action.payload
        },
        addTask: (state, action: PayloadAction<{task: TaskInterface, father?: TaskInterface}>) => {
            const task: TaskInterface = action.payload.task
            if (action.payload.father) {
                const addChildTask = (tasks: TaskInterface[], fatherId: string, taskToAdd: TaskInterface): boolean => {
                    for (const task of tasks) {
                        if (task.customId === fatherId) {
                            task.child = [...(task.child || []), taskToAdd];
                            return true;
                        }
                        if (task.child && addChildTask(task.child, fatherId, taskToAdd)) {
                            return true;
                        }
                    }
                    return false;
                };

                addChildTask(state.tasks, action.payload.father.customId, task);
                addChildTask(state.displayTasks, action.payload.father.customId, task);
            } else {
                state.tasks.push(task)
                state.displayTasks.push(task)
            }
        },
        deleteTask: (state, action: PayloadAction<{task: TaskInterface, father?: TaskInterface}>) => {
            if (action.payload.father) {
                const removeChildTask = (tasks: TaskInterface[], fatherId: string, taskIdToRemove: string): boolean => {
                    for (const task of tasks) {
                        if (task.customId === fatherId) {
                            task.child = task.child?.filter(child => child.customId !== taskIdToRemove) || [];
                            return true;
                        }
                        if (task.child && removeChildTask(task.child, fatherId, taskIdToRemove)) {
                            return true;
                        }
                    }
                    return false;
                };

                removeChildTask(state.tasks, action.payload.father.customId, action.payload.task.customId);
                removeChildTask(state.displayTasks, action.payload.father.customId, action.payload.task.customId);
            } else {
                state.tasks = state.tasks.filter(task => task.customId !== action.payload.task.customId)
                state.displayTasks = state.displayTasks.filter(task => task.customId !== action.payload.task.customId)
            }
        },
        updateTask: (state, action: PayloadAction<{task: TaskInterface, father?: TaskInterface}>) => {
            if (action.payload.father) {
                const updateChildTask = (tasks: TaskInterface[], fatherId: string, taskToUpdate: TaskInterface): boolean => {
                    for (const task of tasks) {
                        if (task.customId === fatherId) {
                            const childIndex = task.child?.findIndex(child => child.customId === taskToUpdate.customId);
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

                updateChildTask(state.tasks, action.payload.father.customId, action.payload.task);
                updateChildTask(state.displayTasks, action.payload.father.customId, action.payload.task);
            } else {
                const taskIndex = state.tasks.findIndex(task => task.customId === action.payload.task.customId)
                if (taskIndex !== -1) {
                    state.tasks[taskIndex] = action.payload.task
                }
                const displaTaskIndex = state.displayTasks.findIndex(task => task.customId === action.payload.task.customId)
                if (displaTaskIndex !== -1){
                    state.displayTasks[displaTaskIndex] = action.payload.task
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
            // const taskIndex = state.tasks.findIndex(task => task.customId === action.payload.task.customId)
            // if (taskIndex !== -1) {
            //     const [task] = state.tasks.splice(taskIndex, 1);
            //     state.tasks.push(task);
            // }
        },
        searchTasks: (state, action: PayloadAction<string>) => {
            if(action.payload.trim() === '') {
                state.displayTasks = state.tasks
                return;
            }
            const searchTerm = action.payload.toLowerCase()
            state.displayTasks = state.tasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm) || 
                (task.description && task.description.toLowerCase().includes(searchTerm)) ||
                (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            )
        }
    }
})

export const { setTasks, filterDisplayTasks, addTask, deleteTask, updateTask, toggleTask, searchTasks } = dataSlice.actions
export default dataSlice.reducer