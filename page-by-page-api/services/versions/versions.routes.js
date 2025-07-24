import { getVersionsByProjectId, deleteAll } from "./versions.controller.js";
import { Router } from "express";


const versionsRouter = Router();


versionsRouter
    .get("/:projectId", getVersionsByProjectId)
    .delete("/:projectId", deleteAll);


export default versionsRouter;