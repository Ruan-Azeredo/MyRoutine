import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
    customId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    date: { type: Number },
    completed_date: { type: Number },
    completed: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    child: { type: Schema.Types.Mixed } // pode ser ajustado se souber o formato exato
}, { timestamps: true });

// Previne recriação do modelo em hot-reload no dev
export default mongoose.models.Task || mongoose.model("Task", TaskSchema) as mongoose.Model<any>