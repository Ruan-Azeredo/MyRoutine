'use client'

import React, { useEffect, useState } from "react";
import Task from "../components/Task";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { filterDisplayTasks, searchTasks, setTasks } from "../store/reducers/data";
import AddTaskInput from "../components/AddTaskInput";
import { login } from "../store/reducers/auth";
import { TaskInterface } from "../types/task";
import useTasksData from "../hooks/useTasksData";
import { ChevronDownIcon, ChevronUpIcon, LoaderCircleIcon, TagIcon } from "lucide-react";
import Filters from "../components/Filters";
import useFilter from "../hooks/useFilter";
import AddTag from "../components/AddTag";

export default function Home() {

	const useTask = useTasksData()

	const tasks = useAppSelector((state) => state.data.tasks)
	const displayTasks = useAppSelector((state) => state.data.displayTasks)
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
	const dispatch = useDispatch()

	const [currentTask, setCurrentTask] = useState<{task: TaskInterface, father: TaskInterface | null} | null>(null)
	const [newTask, setNewTask] = useState<TaskInterface | null>(null)
	const [tasksLoaded, setTasksLoaded] = useState(0)
	const [openTag, setOpenTag] = useState(true)

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const [isSaving, setIsSaving] = useState(false)

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const resp = await fetch("/api/tasks");
				const data = await resp.json();
				dispatch(setTasks(data));
				setTasksLoaded((n) => n + 1);
				console.log("Tasks fetched successfully:", data)
			} catch (err) {
				console.log(err);
			}
		};
		fetchTasks();
	}, [])

	const filter = useFilter()

	useEffect(() => {
        if (tasksLoaded >= 1) {
			console.log('tasksLoaded', tasksLoaded, tasks)
            const updatedTasks = filter.filterTaskArray(tasks)
            dispatch(filterDisplayTasks(updatedTasks))
            console.log(updatedTasks, displayTasks)
        }
    }, [tasks, currentTask, filter.notChecked, filter.priorityOrder, filter.tags, filter.priority])

	useEffect(() => {
		setNewTask(currentTask?.task)
	}, [currentTask])

	return isAuthenticated ? (
		<div className="mx-auto min-h-screen flex w-full">
			{/* <div className="flex min-h-screen "> */}
				<div className="bg-white min-h-full m-1 md:m-4 w-full rounded-xl p-2 md:p-4 flex gap-4">
					<LoaderCircleIcon className={`h-5 w-5 right-8 text-gray-900 animate-spin ${useTask.loading ? 'fixed' : 'hidden'}`}/>

					<main className={`flex-1 ${currentTask?.task.title ? 'hidden md:block' : ''}`}>
						<div className="w-full ml-auto">
							<div className="mb-4 hidden md:block">
								<label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">
									Quick search
								</label>
								<div className="relative mt-2 flex items-center">
									<input
										id="search"
										name="search"
										type="text"
										className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										ref={(input) => {
											if (input) {
												window.addEventListener("keydown", (e) => {
													if (e.metaKey && e.key === "k") {
														e.preventDefault();
														input.focus();
													}
												});
											}
										}}
										onChange={(e) => dispatch(searchTasks(e.target.value))}
									/>
									<div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
										<kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
											⌘K
										</kbd>
									</div>
								</div>
							</div>
							<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
								Adicionar Nova Task
							</label>
							<AddTaskInput />

							<div className="flex justify-between flex-wrap md:flex-nowrap">
								<Filters/>
								<button onClick={() => setOpenTag(!openTag)} className="bg-gray-900 text-gray-100 rounded-md px-2 py-1 mt-0 md:mt-2 mb-2 ml-auto text-xs text-nowrap">
									{openTag ? 'Hide tags' : 'Show tags'}
								</button>
							</div>
							{displayTasks?.map((task, index) => (
								<div key={index}>
									<Task setCurrentTask={setCurrentTask} task={task} openTag={openTag}/>
								</div>
							))}
						</div>
				
					</main>

					<aside className={`${currentTask?.task.title ? 'md:sticky md:top-0 w-full md:w-1/3 lg:block' : 'hidden'} top-8 shrink-0 text-black `}>
						<div className="flex">
							<div className="w-full">
								<input onChange={(e) => setNewTask({...newTask , title: e.target.value})} className="border-none rounded-md w-full font-bold text-md md:text-xl" type="text" value={newTask?.title || currentTask?.task.title}/>
								<div className='flex mt-2'>
									<div className={``}>
										<AddTag task={currentTask?.task} father={currentTask?.father}/>
									</div>
									<div className='flex flex-col h-initial ml-auto'>
										<button onClick={async () => {
											await useTask.sum_priority(currentTask?.task, currentTask?.father)
											.then(() => {
												setCurrentTask({task: {...currentTask?.task, priority: currentTask?.task.priority + 1}, father: currentTask?.father})
											})
										}} className='bg-gray-900 text-gray-100 ml-2 rounded-t-md flex items-center px-2 hover:bg-gray-100 hover:text-gray-900 h-full'>
											<ChevronUpIcon className={`w-4 h-4`}/>
										</button>
										<button onClick={async () => {
											await useTask.subtract_priority(currentTask?.task, currentTask?.father)
											.then(() => {
												setCurrentTask({task: {...currentTask?.task, priority: currentTask?.task.priority - 1}, father: currentTask?.father})
											})
										}} className='bg-gray-900 text-gray-100 ml-2 rounded-b-md flex items-center px-2 hover:bg-gray-100 hover:text-gray-900 h-full'>
											<ChevronDownIcon className={`w-4 h-4`}/>
										</button>
									</div>
								</div>
								<textarea onChange={(e) => setNewTask({...newTask , description: e.target.value})} className="border-1 h-48 rounded-md w-full text-sm mt-8" value={newTask?.description || currentTask?.task.description || ""} />
									<button
										className={`border-[1px] text-sm px-4 py-1 rounded-md border-gray-900 mt-2 mb-4 transition-transform duration-200 ${isSaving ? 'scale-95' : 'scale-100'}`}
										onClick={async () => {
											setIsSaving(true);
											await useTask.update_task(newTask, currentTask.father);
											setTimeout(() => setIsSaving(false), 75); // keep the animation for 200ms
										}}
									>
										Salvar
									</button>
								<AddTaskInput father={currentTask?.task} tags={currentTask?.task.tags}/>
							</div>
							<button className="h-fit" onClick={() => setCurrentTask(null)}>x</button>
						</div>
					</aside>
				</div>
			{/* </div> */}

		</div>
	) : (
		<div className="flex h-screen">
			<div className="bg-white m-4 flex rounded-lg flex-1 flex-col justify-center px-6 py-12 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					  <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
						Sign in to your account
					  </h2>
					</div>
			
					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					  <form action="#" method="POST" className="space-y-6">
						<div>
						  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
							Email address
						  </label>
						  <div className="mt-2">
							<input
							  id="email"
							  name="email"
							  type="email"
							  required
							  onChange={(e) => setEmail(e.target.value)}
							  autoComplete="email"
							  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							/>
						  </div>
						</div>
			
						<div>
						  <div className="flex items-center justify-between">
							<label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
							  Password
							</label>
						  </div>
						  <div className="mt-2">
							<input
							  id="password"
							  name="password"
							  type="password"
							  required
							  onChange={(e) => setPassword(e.target.value)}
							  autoComplete="current-password"
							  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
							/>
						  </div>
						</div>
			
						<div>
						  <button
							onClick={() => dispatch(login({email: email, password: password}))}
							className="flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						  >
							Sign in
						  </button>
						</div>
					  </form>
					</div>
				  </div>
		</div>
	)
}
