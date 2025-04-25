import { getBooks, addBook, updateBook, deleteBook } from "../controllers/book.controller.js";
import { Router } from "express";

const bookRouter = Router();

bookRouter
    .get("/", getBooks)
    .post("/", addBook)
    .put("/:id", updateBook)
    .delete("/:id", deleteBook);

export default bookRouter;
