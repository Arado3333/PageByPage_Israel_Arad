import { MongoClient, ObjectId } from "mongodb";

export async function getProjectsFromDB() {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("BookProjects")
            .find({ isDeleted: { $exists: false } })
            .toArray();
    } catch (error) {
        console.error("Error fetching projects from database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}

export async function getProjectsFromDBById(id) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("BookProjects")
            .find({ userId: id, isDeleted: { $exists: false } })
            .toArray();
    } catch (error) {
        console.error("Error fetching projects from database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}

export async function getProjectById(projectId) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("BookProjects")
            .findOne({ _id: createFromHexString(projectId) })
            .toArray();
    } catch (error) {
        console.error("Error fetching project from database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}

export async function saveToDB(project) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("BookProjects").insertOne(project);
    } catch (error) {
        throw new Error("Error saving project to database");
    } finally {
        if (client) client.close();
    }
}

export async function updateToDB(id, project) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("BookProjects")
            .updateOne(
                { _id: ObjectId.createFromHexString(id) },
                { $set: project }
            );
    } catch (error) {
        throw new Error("Error saving project to database");
    } finally {
        if (client) client.close();
    }
}

export async function deleteFromDB(id)
{
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("BookProjects")
            .deleteOne({ _id: ObjectId.createFromHexString(id) });
    } catch (error) {
        throw new Error("Error deleting project from database");
    } finally {
        if (client) client.close();
    }
}
