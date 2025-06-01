import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/mongodb";
import Task from "../../../models/Task";
import { TaskInterface } from "../../../types/task";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case "GET":
      const tasks = await Task.find({});
      return res.status(200).json(tasks);

    case "POST":
      const { task, father } = req.body;

      try {
        if (father) {
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
  
          const allTasks = await Task.find({});
          addChildTask(allTasks, father.customId, task);

          // Update each task individually in the database
          for (const updatedTask of allTasks) {
            await Task.findByIdAndUpdate(updatedTask._id, updatedTask);
          }

          return res.status(201).json(task);
        } else {
          const newTask = await Task.create(task);
          return res.status(201).json(newTask);
        }
      } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ error: "Failed to create task" });
      }

    default:
      return res.status(405).end(); // Método não permitido
  }
}
