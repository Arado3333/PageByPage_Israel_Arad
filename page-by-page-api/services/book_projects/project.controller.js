import { ObjectId } from "mongodb";
import Project from "./project.model.js";
import Book from "../books/models/book.model.js";

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
        const book = new Book(saved.insertedId, title, author, genres);
        const createdBook = await book.createBook();

        res.status(201).json({
            success: true,
            projectId: saved.insertedId,
            bookId: createdBook.insertedId,
        });
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
        updateData.assets,
        updateData.chapters
    );

    let book = await Book.getBookByProjectId(projectId);

    if (book) {
        const updated = new Book(
            projectId,
            updatedProject.title,
            updatedProject.author,
            updatedProject.genres,
            null,
            updatedProject.chapters
        );
        const result = await updated.update(
            typeof book._id === "string" ? book._id : book._id.toString()
        );
        if (!result.acknowledged) {
            res.status(500).json({
                success: false,
                message: "Error while updating book"
            })
        }
    }

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

// //
export async function deleteDraftById(req, res) {
    const { projectId, draftId } = req.params;

    try {
        const confirm = await Project.deleteDraftById(projectId, draftId);

        if (confirm) {
            res.status(200).json({
                success: true,
                message: "Draft deleted successfully",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting draft",
        });
    }
}

export async function deleteProject(req, res) {
    const { projectId } = req.params;

    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    try {
        await Project.deleteProject(projectId);
        return res.status(200).json({
            success: true,
            message: "Project has been deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting project",
        });
    }
}
