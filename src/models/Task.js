import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid"

const TaskSchema = new mongoose.Schema({
    // id: {type: String, default: uuidv4, unique: true},
    title: {type: String, required: true},
    description: String,
    status: {type: String, enum: ["To Do", "In Progress", "Done"], required: true},
    priority: {type: String, enum: ["Low", "Medium", "High"], required: true},
    dueDate: Date,
    assignee: String
})

export default mongoose.models.Task || mongoose.model('Task', TaskSchema)