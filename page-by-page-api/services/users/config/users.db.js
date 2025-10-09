import { MongoClient, ObjectId } from "mongodb";

export async function getAll() {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);
    return await db.collection("Users").find({}).toArray();
  } catch (error) {
    console.error("Error fetching users from database:", error);
    throw error;
  } finally {
    if (client) {
      client.close();
    }
  }
}

export async function getUserByEmail(email) {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);
    return await db.collection("Users").findOne({ email });
  } catch (error) {
    console.error("Error fetching user by email from database", error);
    throw error;
  } finally {
    if (client) {
      client.close();
    }
  }
}

export async function getUserProfile(userId) {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);
    return await db
      .collection("Users")
      .findOne({ _id: ObjectId.createFromHexString(userId) });
  } catch (error) {
    console.error("Error fetching user profile from database", error);
    throw error;
  } finally {
    if (client) {
      client.close();
    }
  }
}

export async function createUser(user) {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);
    return await db.collection("Users").insertOne(user);
  } catch (error) {
    console.error("Error registering new user to database:", error);
    throw error;
  } finally {
    if (client) {
      client.close();
    }
  }
}

export async function updateUser(id, user) {
  let client = null;

  try {
    client = await MongoClient.connect(process.env.CONNECTION_STRING);
    let db = client.db(process.env.DB_NAME);

    // Remove _id from the update object to avoid immutable field error
    const { _id, ...updateData } = user;

    return await db
      .collection("Users")
      .updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updateData }
      );
  } catch (error) {
    console.error("Error updating user in database:", error);
    throw error;
  } finally {
    if (client) {
      client.close();
    }
  }
}
