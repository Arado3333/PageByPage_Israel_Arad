import { ObjectId } from "mongodb";
import Book from "../models/book.model.js";

export async function getBooks(req, res) {
    try {
        const books = await Book.findAll();
        return res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error });
    }
}

export async function getBookByProjectId(req, res) {
    const { projId } = req.params;
    console.log(projId);

    if (!projId) {
        return res.status(400).json({ message: "ProjectId is required" });
    }

    try {
        const book = await Book.getBookByProjectId(projId);
        return res.status(200).json({ success: true, book: book });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Error while deleting project: " + error,
            });
    }
}

export async function addBook(req, res) {
    console.log("Req: \n" + req.body);

    let { title, author, genres, coverImg } = req.body;
    if (!title || !author) {
        return res
            .status(400)
            .json({ message: "Title and Author are required" });
    }

    const newBook = new Book(title, author, genres, coverImg);
    console.log(newBook);

    //בקשה לשמירת ספר חדש
    try {
        const saved = await newBook.createBook();
        res.status(201).json({ success: true, message: saved });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while adding the book",
        });
    }
}

export async function updateBook(req, res) {
    let { id } = req.params;
    let { title, author, genres, coverImg, chapters } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Book ID is required" });
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Book ID" });
    }
    if (!title || !author) {
        return res
            .status(400)
            .json({ message: "Title and Author are required" });
    }

    const updatedBook = new Book(title, author, genres, coverImg);

    //בקשה לעדכון ספר קיים
    try {
        const result = await updatedBook.update(id);
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error while updating the book" });
    }
}

export async function deleteBook(req, res) {
    let { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Book ID is required" });
    }
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Book ID" });
    }

    //בקשה למחיקת ספר
    try {
        const result = await Book.delete(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error while deleting the book" });
    }
}
