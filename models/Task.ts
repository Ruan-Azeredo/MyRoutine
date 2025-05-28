import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Number },
    completed_date: { type: Number },
    completed: { type: Boolean, default: false },
    tags: { type: [String] },
    child: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
