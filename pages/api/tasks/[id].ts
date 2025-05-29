import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/mongodb";
import Task from "../../../models/Task";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { id } = req.query;
  const taskId = Array.isArray(id) ? id[0] : id;

  if (!taskId) return res.status(400).json({ error: "ID inválido" });

  console.log(`Handling request for task with customId: ${taskId}`);

  try {
    switch (req.method) {
      case "PUT": {
        const updated = await Task.findOneAndUpdate(
          { customId: taskId },
          req.body,
          { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Tarefa não encontrada" });
        return res.status(200).json(updated);
      }

      case "DELETE": {
        const deleted = await Task.findOneAndDelete({ customId: taskId });
        if (!deleted) return res.status(404).json({ error: "Tarefa não encontrada" });
        return res.status(204).end();
      }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (err) {
    console.error("Erro no handler:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}