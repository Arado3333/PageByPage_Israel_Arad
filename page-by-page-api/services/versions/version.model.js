import { getVersionsFromDB, deleteAllFromDB } from "./versions.db.js";

export default class Version {
    constructor(projectId, drafts = [], date = new Date().toISOString()) {
        this.versionId = Date.now();
        this.projectId = projectId;
        this.drafts = drafts;
        this.date = date;
    }

    static async getAllVersionsByProjectId(projectId) {
        try {
            return await getVersionsFromDB(projectId);
        } catch (error) {
            throw new Error("Error while fetching versions");
        }
    }

    static async deleteAllByProjectId(projectId) {
        try {
            return await deleteAllFromDB(projectId);
        } catch (error) {
            throw new Error("Error while deleting versions");
        }
    }
}
