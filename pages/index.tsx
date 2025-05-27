import React from "react";
import Task from "../components/Task";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { searchTasks } from "../store/reducers/data";
import AddTaskInput from "../components/AddTaskInput";

export default function Home() {

	const tasks = useAppSelector((state) => state.data.tasks)
	const dispatch = useDispatch()

	return (
		<div className="flex h-screen">
			<div className="bg-white m-4 w-full rounded-xl p-4">
				<div className="w-full lg:w-1/2 ml-auto">
					<div className="mb-4">
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
					{tasks.map((task, index) => (
						<Task task={task} key={index}/>
					))}
				</div>
			</div>
		</div>
	)
}
