import { MongoClient, ObjectId } from "mongodb";

export async function getVersionsFromDB(projectId) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("VersionHistory")
            .find({ projectId: projectId, isDeleted: { $exists: false } })
            .toArray();
    } catch (error) {
        console.error("Error fetching versions from database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}

export async function deleteAllFromDB(projectId) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("VersionHistory")
            .deleteMany({ projectId: projectId });
    } catch (error) {
        console.error("Error fetching versions from database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}
