import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/mongodb";
import Task from "../../../models/Task";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case "GET":
      const tasks = await Task.find({});
      return res.status(200).json(tasks);

    case "POST":
      const newTask = await Task.create(req.body);
      return res.status(201).json(newTask);

    default:
      return res.status(405).end(); // Método não permitido
  }
}
