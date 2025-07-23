import { getVersionsFromDB } from "./versions.db.js";

export default class Version {
    static id = 0;

    constructor(projectId, drafts = []) {
        this.versionId = Version.id++;
        this.projectId = projectId;
        this.drafts = drafts;
    }

    static async getAllVersionsByProjectId(projectId) {
        try {
            return await getVersionsFromDB(projectId);
        } catch (error) {
            throw new Error("Error while fetching versions");
        }
    }
}
