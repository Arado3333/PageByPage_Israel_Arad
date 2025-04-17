
export default class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
        this.createdAt = new Date();
    }

    static async findAll() {
        try {
            return await getBooksFromDB();
        } catch (error) {
            throw new Error("Error fetching books");
        }
    }

    static async createBook(bookData) {
        try {
            return await saveBookToDB(bookData);
        } catch (error) {
            throw new Error("Error saving book");
        }
    }

    static async update(id, bookData) {
        try {
            return await updateBookInDB(id, bookData);
        } catch (error) {
            throw new Error("Error updating book");
        }
    }

    static async delete(id) {
        try {
            return await deleteBookFromDB(id);
        } catch (error) {
            throw new Error("Error deleting book");
        }
    }
}
