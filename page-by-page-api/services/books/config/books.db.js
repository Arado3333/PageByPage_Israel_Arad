import { MongoClient, ObjectId } from "mongodb";

export async function getBooksFromDB() {
    let client = null;

    try {
        console.log("opening connection to database");
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("Books").find({isDeleted: { $exists: false } }).toArray();
    } catch (error) {
        console.error("Error fetching books from database:", error);
        throw error;
    } finally {
        if (client) client.close();
        console.log("Connection closed");
    }
}

export async function saveBookToDB(book) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db.collection("Books").insertOne(book);
    } catch (error) {
        console.error("Error saving book to database:", error);
        throw error;
    } finally {
        if (client) client.close();
    }
}

export async function updateBookInDB(id, book) {
    let client = null;

    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("Books")
            .updateOne(
                { _id: ObjectId.createFromHexString(id) },
                { $set: book }
            );
    } catch (error) {
        console.error("Error updating book in database:", error);
        throw error;
    } finally {
        if (client) {
            client.close();
        }
    }
}


export async function deleteBookFromDB(id) {
    let client = null;
    
    try {
        let client = await MongoClient.connect(process.env.CONNECTION_STRING);
        let db = client.db(process.env.DB_NAME);
        return await db
            .collection("Books")
            .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { isDeleted: true } });
    } catch (error) {
        console.error("Error deleting book from database:", error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}
