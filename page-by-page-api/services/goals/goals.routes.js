import { Router } from "express";
import { getUserGoals, createGoal, updateGoal } from "./goals.controller.js";

const goalsRouter = Router();

goalsRouter
.get("/:userId", getUserGoals)
.post("/:userId", createGoal)
.put("/:goalId", updateGoal)
// .delete("/:userId/:goalId", deleteGoal)



export default goalsRouter;