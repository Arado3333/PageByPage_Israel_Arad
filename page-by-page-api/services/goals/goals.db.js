import { ObjectId, MongoClient } from "mongodb";

export async function getGoalsFromDB(userId) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("Goals").find({ userId: userId }).toArray();
    } catch (error) {
        console.error("Error fetching goals from database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}

export async function createGoalInDB(goalObj) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("Goals").insertOne(goalObj);
    } catch (error) {
        console.error("Error creating goal in database:", error);
        throw error;
    }
}
export async function updateGoalInDB(updateObj) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("Goals")
            .updateOne({ id: updateObj.id }, { $set: updateObj });
    } catch (error) {
        console.error("Error updating goal in database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}

export async function getGoalByIdFromDB(goalId) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("Goals").findOne({ id: goalId });
    } catch (error) {
        console.error("Error fetching goal by ID from database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}
