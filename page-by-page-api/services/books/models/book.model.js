import { getBooksFromDB, saveBookToDB, updateBookInDB, deleteBookFromDB, findBookByProjectId } from "../config/books.db.js";

export default class Book {
    constructor(projectId, title, author, genres = [], coverImg = null, chapters = []) {
        this.projectId = projectId;
        this.title = title;
        this.author = author;
        this.genres = genres;
        this.coverImg = coverImg; //base64URL | cloudinary signed URL
        this.chapters = chapters;
        this.createdAt = new Date().toString();
    }

    static async findAll() {
        try {
            return await getBooksFromDB();
        } catch (error) {
            throw new Error("Error fetching books");
        }
    }

    static async getBookByProjectId(projId)
    {
        try {
            return await findBookByProjectId(projId);
        } catch (error) {
            throw new Error("Error fetching book");
        }
    }
    
    static async delete(id) {
        try {
            return await deleteBookFromDB(id);
        } catch (error) {
            throw new Error("Error deleting book");
        }
    }

    async createBook() {
        try {
            return await saveBookToDB(this);
        } catch (error) {
            throw new Error("Error saving book");
        }
    }

    async update(id) {
        try {
            return await updateBookInDB(id, this);
        } catch (error) {
            throw new Error("Error updating book");
        }
    }

    
}
