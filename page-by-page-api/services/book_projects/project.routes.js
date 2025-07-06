import { getBookProjects, createProject, getProjectsById, updateProject, deleteProject } from "./project.controller.js";
import { Router } from "express";

const projectsRouter = Router();

//TODO: Add middleware to check Authentication header - JWT

projectsRouter
    .get("/", getBookProjects)
    .get("/:userId", getProjectsById)
    .post("/", createProject)
    .put("/:projectId", updateProject)
    .delete("/:projectId", deleteProject);

export default projectsRouter;