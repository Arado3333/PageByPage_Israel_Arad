import Task from "./task.model.js";

export async function getTasksByUserId(req, res) {
    const userId = req.params.userId;

    try {
        const tasks = await Task.getAllTasksByUserId(userId);
        res.status(200).json({ success: true, tasks: tasks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving tasks",
            error,
        });
    }
}

export async function createTask(req, res) {
    console.log(req.body);
    
    const { task, userId } = req.body;

    const newTask = new Task(task, userId); //initiates new Task instance, duplicating client's Task instance.
    console.log(newTask);

    try {
        const task = await newTask.createTask();
        res.status(201).json({ success: true, createdTask: task });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating task",
            error,
        });
    }
}

export async function updateTask(req, res) {
    try {
        const updatedTask = await Task.updateTask(req.params.id, req.body);
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ success: true, updatedTask: updatedTask });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating task",
            error,
        });
    }
}

export async function deleteTask(req, res) {
    try {
        const deleted = await Task.deleteTaskById(req.params.taskId);
        if (!deleted) {
            return res
                .status(404)
                .json({ success: false, message: "Task not found" });
        }
        res.status(200).json({
            success: true,
            message: "Task has been deleted successfuly",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting task",
            error,
        });
    }
}
