import { ObjectId } from "mongodb";
import Project from "./project.model.js";

export async function getBookProjects(req, res) {
    try {
        const projects = await Project.getAllProjects();
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(400).json("Error fetching projects");
    }
}

export async function getProjectsById(req, res) {
    let { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const projects = await Project.getAllById(userId);
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(400).json("Error fetching projects");
    }
}

export async function createProject(req, res) {
    console.log(req.body);

    const {
        userId,
        author,
        title,
        genres,
        status,
        description,
        drafts,
        notes,
        assets,
    } = req.body;

    let project = new Project(
        userId,
        author,
        title,
        genres,
        status,
        description,
        drafts,
        notes,
        assets
    );

    try {
        const saved = await project.createProjectInDB();
        res.status(201).json({ success: true, message: saved });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while adding the project",
        });
    }
}

export async function updateProject(req, res) {
    const { projectId } = req.params;
    const updateData = req.body;

    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    const updatedProject = new Project(
        updateData.userId,
        updateData.author,
        updateData.title,
        updateData.genres,
        updateData.status,
        updateData.description,
        updateData.drafts,
        updateData.notes,
        updateData.characts,
        updateData.assets
    );

    console.log(updatedProject);
    

    try {
        await updatedProject.updateProjectById(projectId);
        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ success: true, project: updatedProject });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating project",
        });
    }
}

export async function deleteProject(req, res)
{
    const { projectId } = req.params;

    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    try {
        await Project.deleteProject(projectId);
        return res.status(200).json({success: true, message: "Project " + projectId + "has been deleted successfully"})
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting project",
        });
    }
}
