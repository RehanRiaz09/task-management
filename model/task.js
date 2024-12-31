const mongoose = require("mongoose")
const taskSchema = mongoose.Schema({
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true},
    status: {type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending'},
    priority: {type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium'},
    dueDate: {type: Date},
    category: {type: String, default: 'General'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})
module.exports = mongoose.model("Task", taskSchema)