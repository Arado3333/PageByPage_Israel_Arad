import { getBooks, createBook, updateBook, deleteBook } from "../controllers/book.controller.js";
import { Router } from "express";

const router = Router();

router
    .get("/", getBooks)
    .post("/", createBook)
    .put("/:id", updateBook)
    .delete("/:id", deleteBook);

export default router;
