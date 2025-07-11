//DB Functions
import { MongoClient, ObjectId } from 'mongodb';

export default class DB {

    private client: MongoClient | null = null;
    private dbName: string = process.env.DB_NAME || 'mydatabase';

    constructor() {
        this.connect(); //connects each DB function call from model.
    }

    private async connect() {
        const uri = process.env.CONNECTION_STRING || 'mongodb://localhost:27017';
        this.client = new MongoClient(uri);

        try {
            await this.client.connect();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    private async disconnect() { //optional - the class instance closes the connection automatically after return
        try {
            await this.client?.close();
            console.log('Disconnected from MongoDB');

        } catch (err) {
            console.error('Error disconnecting from MongoDB:', err);
        }
    }

    async GetDocumentByEmail(collection: string, email: string)
    {
        try {
            return this.client?.db(this.dbName).collection(collection).findOne({ email });
        } catch (error) {
            console.error('Error fetching document by email:', error);
            throw error;
        }
    }

    async AddDocument(collection: string, document: any) {
        try {
            return this.client?.db(this.dbName).collection(collection).insertOne(document);
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
        finally {
            //this.disconnect();
        }
    }

    async GetDocumentById(collection: string, id: string) {
        try {
            return this.client?.db(this.dbName).collection(collection).findOne({ _id: ObjectId.createFromHexString(id) });
        } catch (error) {
            console.error('Error getting document by ID:', error);
            throw error;
        }
        finally {
            //this.disconnect();
        }
    }

    async GetDocuments(collection: string, filter: any = {}) {
        try {
            return this.client?.db(this.dbName).collection(collection).find(filter).toArray();
        } catch (error) {
            console.error('Error getting documents:', error);
            throw error;
        }
        finally {
            //this.disconnect();
        }
    }

    async UpdateDocument(collection: string, id: string, update: any) {
        try {
            return this.client?.db(this.dbName).collection(collection).updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: update });
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
        finally {
            //this.disconnect();
        }
    }
    async DeleteDocument(collection: string, id: string) {
        try {
            return this.client?.db(this.dbName).collection(collection).deleteOne({ _id: ObjectId.createFromHexString(id) });
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
        finally {
            //this.disconnect();
        }
    }

    async AggregateDocuments(collection: string, pipeline: any[]) {
        try {
            return this.client?.db(this.dbName).collection(collection).aggregate(pipeline).toArray();
        } catch (error) {
            console.error('Error aggregating documents:', error);
            throw error;
        }
        finally {
            //this.disconnect();
        }
    }

    // async Lookup(collection: string, localField: string, foreignCollection: string, foreignField: string, asField: string, match: any = {}) {
    //     try {
    //         const pipeline = [
    //             { $match: match },
    //             {
    //                 $lookup: {
    //                     from: foreignCollection,
    //                     localField: localField,
    //                     foreignField: foreignField,
    //                     as: asField
    //                 }
    //             }
    //         ];
    //         return this.client?.db(this.dbName).collection(collection).aggregate(pipeline).toArray();
    //     } catch (error) {
    //         console.error('Error performing lookup:', error);
    //         throw error;
    //     }
    // }

}