import { getBooks, addBook, updateBook, deleteBook } from "../controllers/book.controller.js";
import { Router } from "express";

const router = Router();

router
    .get("/", getBooks)
    .post("/", addBook)
    .put("/:id", updateBook)
    .delete("/:id", deleteBook);

export default router;
