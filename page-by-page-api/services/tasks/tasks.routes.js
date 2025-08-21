import { Router } from "express";
import {getTasksByUserId, createTask, deleteTask, getTasks} from "./tasks.controller.js";

const tasksRouter = Router();


tasksRouter
    .get("/", getTasks)
    .get("/:userId", getTasksByUserId)
    .post("/new", createTask)
  //  .put("/update/:taskId", updateTask)
   .delete("/:taskId", deleteTask)




export default tasksRouter;