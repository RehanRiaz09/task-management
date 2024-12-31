const express =  require("express")
const routes = express.Router();
const mongoose = require("mongoose")
const Task = require("../model/task")

// create the task 
routes.post("/", async (req, res, next)=>{
    try{
const task = new Task({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    category: req.body.category,
    user: req.body.user,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt,
});
await task.save()
res.status(200).json({
    message: "Task create sucessfully"
})
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})

// get all task
routes.get("/", async (req, res, next)=>{
try{
const docs = await Task.find().populate("user", 'userName email')
res.status(200).json({
    count: docs.length,
    task: docs,
})
}catch(err){
    console.log(err);
    res.status(500).json({
        error: err
    })
}
})

// get by id

routes.get("/:taskId", async(req, res, next)=>{
    try{
const id = req.params.taskId;
const doc = await Task.findById(id).populate("user", 'userName email')
console.log(doc);
if(doc){
    res.status(400).json({
        task: doc,
    })
}else{
    res.status(200).json({
        message: "No valid entry found for the this provide ID"
    })
}
    }catch(err){
    console.log(err);
    res.status(500).json({
        error: err
    })
}
})

// pagination 

routes.get("/task", async(req, res, next)=>{
    try{
const page = parseInt(req.query.p)  ||1;
const limit = 10;
const skip = (page - 1) * limit;
const totalTask = await Task.countDocument();
const tasks = await Task.find().skip(skip).llimit(limit)
const totalPages = Math.ceil(totalTask/limit);
res.status(200).json({
    message: "Fake users retrieved successfully",
    currentPage: page,
            totalPages: totalPages,
            itemsPerPage: limit,
            totalUsers: totalUsers,
            tasks: tasks,
})
    }catch(err){
    console.log(err);
    res.status(500).json({
        error: err
    })
}
})

// update the task
routes.patch("/:taskId", async (req, res, next)=>{
    try{
const id = req.params.taskId;
await Task.updateOne({_id: id}, {
    $set: {
        title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    category: req.body.category,
    user: req.body.user,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt,
    }
})
res.status(200).json({
    message: "Task updated"
})
    }catch(err){
    console.log(err);
    res.status(500).json({
        error: err
    })
}
})

// delete the task

routes.delete("/:taskId", async(req, res)=>{
    try{
        const id = req.params.taskId;
        await Task.deleteOne({id: id})
        res.status(200).json({
            message: "Task deleted"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
})
module.exports = routes