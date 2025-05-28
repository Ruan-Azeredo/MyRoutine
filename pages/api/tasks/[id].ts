import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/mongodb";
import Task from "../../../models/Task";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(updated);

    case "DELETE":
      await Task.findByIdAndDelete(id);
      return res.status(204).end();

    default:
      return res.status(405).end();
  }
}
