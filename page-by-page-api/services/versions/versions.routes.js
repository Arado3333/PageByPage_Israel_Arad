import { getVersionsByProjectId } from "./versions.controller.js";
import { Router } from "express";


const versionsRouter = Router();


versionsRouter
    .get("/:projectId", getVersionsByProjectId)


export default versionsRouter;