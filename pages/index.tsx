'use client'

import React, { useState } from "react";
import Task from "../components/Task";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { searchTasks } from "../store/reducers/data";
import AddTaskInput from "../components/AddTaskInput";
import { login } from "../store/reducers/auth";

export default function Home() {

	const tasks = useAppSelector((state) => state.data.tasks)
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
	const dispatch = useDispatch()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	return isAuthenticated ? (
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
						<div key={index}>
							<Task task={task}/>
						</div>
					))}
				</div>
			</div>
		</div>
	) : (
		<div className="flex h-screen">
			<div className="bg-white m-4 flex rounded-lg flex-1 flex-col justify-center px-6 py-12 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					  <img
						alt="Your Company"
						src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
						className="mx-auto h-10 w-auto"
					  />
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
							<div className="text-sm">
							  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
								Forgot password?
							  </a>
							</div>
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
							onClick={() => dispatch(login({user: process.env.NEXT_PUBLIC_EMAIL, password: process.env.NEXT_PUBLIC_PASSWORD}))}
							className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						  >
							Sign in
						  </button>
						</div>
					  </form>
			
					  <p className="mt-10 text-center text-sm/6 text-gray-500">
						Not a member?{' '}
						<a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
						  Start a 14 day free trial
						</a>
					  </p>
					</div>
				  </div>
		</div>
	)
}
