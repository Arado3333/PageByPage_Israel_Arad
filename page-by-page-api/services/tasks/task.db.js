import { MongoClient, ObjectId } from "mongodb";

export async function getTasksByUserId(id) {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);
    return await db
      .collection("Tasks")
      .find({ userId: id, isDeleted: { $exists: false } })
      .toArray();
  } catch (error) {
    console.error("Error fetching tasks from database:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}

export async function getTasksFromDB() {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);
    return await db.collection("Tasks").find().toArray();
  } catch (error) {
    console.error("Error fetching tasks from database:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}

export async function createTaskInDB(task) {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);
    return await db.collection("Tasks").insertOne(task);
  } catch (error) {
    console.error("Error saving task in database:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}

export async function deleteTaskFromDB(id) {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);
    return await db
      .collection("Tasks")
      .deleteOne({ _id: ObjectId.createFromHexString(id) });
  } catch (error) {
    console.error("Error deleting task from database:", error);
    throw error;
  } finally {
    if (client) client.close();
  }
}
