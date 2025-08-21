import { getTasksByUserId, createTaskInDB, deleteTaskFromDB, getTasksFromDB } from "./task.db.js";

export default class Task {

    static id = 0;

    constructor(
        task,
        userId //copy constructor --> the original task object was built on the client
    ) {
        this.id = Task.id++;
        this.userId = userId;
        this.title = task.title;
        this.fullTitle = task.fullTitle;
        this.category = task.category;
        this.day = task.day;
        this.month = task.month;
        this.year = task.year;
    }

    static async getAllTasksByUserId(userId) {
        try {
            return await getTasksByUserId(userId);
        } catch (error) {
            throw new Error("Error while retrieving tasks by userId from DB");
        }
    }

    static async getAllTasks() {
        try {
            return await getTasksFromDB();
        } catch (error) {
            throw new Error("Error while retrieving tasks from DB");
        }
    }

    static async deleteTaskById(taskId)
    {
        try {
            return await deleteTaskFromDB(taskId);
        } catch (error) {
            throw new Error("Error while deleting task from DB");
        }
    }

    async createTask() {
        try {
            return await createTaskInDB(this);
        } catch (error) {
            throw new Error("Error while creating task in DB");
        }
    }
}
