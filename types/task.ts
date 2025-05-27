export interface TaskInterface {
    id: string
	title: string
	description: string | null
	date: number | null
	completed_date: number | null
	completed: boolean
	tags: string[]
	priority: number | null
	child: TaskInterface[] | null
}

export interface TaskProps {
	title: string
	description: string | null
	date: number | null
	completed_date: number | null
	completed: boolean
	tags: string[]
	priority: number | null
	child: TaskInterface[] | null
}