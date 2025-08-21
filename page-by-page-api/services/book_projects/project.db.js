import { MongoClient, ObjectId } from "mongodb";
import Version from "../versions/version.model.js";

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
      .findOne({ _id: ObjectId.createFromHexString(projectId) });
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

    //Archive the recent project's version
    const document = await getProjectById(id);
    if (document) {
      const prevVersion = new Version(id, document.drafts);
      await db.collection("VersionHistory").insertOne(prevVersion);
    }

    await db
      .collection("BookProjects")
      .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: project });

    const currentVersion = new Version(id, project.drafts);
    await db.collection("VersionHistory").insertOne(currentVersion);
  } catch (error) {
    console.log(error);

    throw new Error("Error saving project to database");
  } finally {
    if (client) client.close();
  }
}

export async function deleteFromDB(id) {
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

export async function deleteDraftFromDB(projectId, draftId) {
  let client = null;
  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);

    // Find the project
    const project = await db
      .collection("BookProjects")
      .findOne({ _id: ObjectId.createFromHexString(projectId) });
    if (!project) {
      throw new Error("Project not found");
    }

    // Remove the draft in JS
    const updatedDrafts = (project.drafts || []).filter((draft) => {
      // Support both ObjectId and string for _id
      const draftIdStr = draft.id?.toString?.() || draft.id;
      return draftIdStr !== draftId;
    });

    // Update the project with the new drafts array
    return await db
      .collection("BookProjects")
      .updateOne(
        { _id: ObjectId.createFromHexString(projectId) },
        { $set: { drafts: updatedDrafts } }
      );
  } catch (error) {
    throw new Error("Error deleting draft from project");
  } finally {
    if (client) client.close();
  }
}
