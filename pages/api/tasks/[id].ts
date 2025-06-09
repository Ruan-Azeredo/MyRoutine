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
        const { father, task } = req.body;

        if (father) {
          const updateChildTask = async (fatherId: string, taskToUpdate: any): Promise<any | null> => {
            const parentTask = await Task.findOne({ customId: fatherId });
            if (parentTask && parentTask.child) {
              const childIndex = parentTask.child.findIndex((child: any) => child.customId === taskToUpdate.customId);
              if (childIndex !== -1) {
                // Update only the fields you want to change
                Object.assign(parentTask.child[childIndex], taskToUpdate);

                // Mark the path as modified
                parentTask.markModified('child');

                // Save parentTask to persist the change
                const updatedTask = await parentTask.save();

                console.log(`Child task updated: ${JSON.stringify(parentTask.child[childIndex])}`);
                return parentTask.child[childIndex];
              }
            }
            return null;
          };


          const updatedChild = await updateChildTask(father.customId, task);
          if (!updatedChild) {
            return res.status(404).json({ error: "Tarefa ou pai não encontrado" });
          }
          return res.status(200).json(updatedChild);
        } else {
          const updated = await Task.findOneAndUpdate({ customId: task.customId }, task, { new: true });
          if (!updated) return res.status(404).json({ error: "Tarefa não encontrada" });
          return res.status(200).json(updated);
        }
      }

      case "DELETE": {
        const { father } = req.body;
        console.log(`Deleting task with customId: ${taskId}, Father: ${father ? father?.customId : "None"}`);

        if (father && father?.customId) {
          console.log(`Removing child task from father with customId: ${father.customId}`);
          const removeChildTask = async (fatherId: string, taskIdToRemove: string): Promise<boolean> => {
            const parentTask = await Task.findOne({ customId: fatherId });
            if (parentTask) {
              parentTask.child = parentTask.child?.filter((child: any) => child.customId !== taskIdToRemove) || [];
              await parentTask.save();
              return true;
            }
            return false;
          };

          const deleted = await removeChildTask(father?.customId, taskId);
          if (!deleted) return res.status(404).json({ error: "Tarefa ou pai não encontrado" });
          return res.status(204).end();
        } else {
          console.log(`Deleting task with customId: ${taskId}`);
          const deleted = await Task.findOneAndDelete({ customId: taskId });
          if (!deleted) return res.status(404).json({ error: "Tarefa não encontrada" });
          return res.status(204).end();
        }
      }

      default:
        return res.status(405).json({ error: "Método não permitido" });
    }
  } catch (err) {
    console.error("Erro no handler:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}