import Book from "../books/models/book.model.js";
import {
    getProjectsFromDB,
    saveToDB,
    getProjectsFromDBById,
    updateToDB,
    deleteFromDB,
    getProjectById,
    deleteDraftFromDB,
} from "./project.db.js";

export default class Project {
    constructor(
        userId,
        author,
        title,
        genres = [],
        status,
        description,
        drafts = [],
        notes = [],
        characts = [],
        assets = [],
        chapters = []
    ) {
        this.userId = userId;
        this.author = author;
        this.title = title;
        this.genres = genres;
        this.status = status;
        this.description = description;
        this.drafts = drafts;
        this.notes = notes;
        this.characts = characts;
        this.assets = assets;
        this.chapters = chapters;
    }

    static async getAllProjects() {
        try {
            return await getProjectsFromDB();
        } catch (error) {
            throw new Error("Error fetching projects");
        }
    }

    static async getAllById(userId) {
        try {
            return await getProjectsFromDBById(userId);
        } catch (error) {
            throw new Error("Error fetching projects, userId: " + userId);
        }
    }

    static async getProjectById(projectId) {
        try {
            return await getProjectById(projectId); //TODO: finish this function
        } catch (error) {
            throw new Error("Error fetching projects, userId: " + userId);
        }
    }

    static async deleteProject(projectId) {
        try {
            return await deleteFromDB(projectId);
        } catch (error) {
            throw new Error("Error deleting project");
        }
    }

    static async deleteDraftById(projectId, draftId) {
        try {
            return await deleteDraftFromDB(projectId, draftId);
        } catch (error) {
            throw new Error("Error deleting draft");
        }
    }

    async updateProjectById(projectId) {
        try {
            return await updateToDB(projectId, this);
        } catch (error) {
            throw new Error("Error saving project");
        }
    }

    async createProjectInDB() {
        try {
            return await saveToDB(this);
        } catch (error) {
            throw new Error("Error creating project in DB");
        }
    }
}
