import { getBooksFromDB, saveBookToDB, updateBookInDB, deleteBookFromDB } from "../config/books.db.js";

export default class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
        this.createdAt = new Date().toString();
    }

    static async findAll() {
        try {
            return await getBooksFromDB();
        } catch (error) {
            throw new Error("Error fetching books");
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
