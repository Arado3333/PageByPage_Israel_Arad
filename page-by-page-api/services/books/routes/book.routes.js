import { getBooks, addBook, updateBook, deleteBook, getBookByProjectId } from "../controllers/book.controller.js";
import { Router } from "express";

const bookRouter = Router();

bookRouter
    .get("/", getBooks)
    .get("/:projId", getBookByProjectId)
    .post("/", addBook)
    .put("/:id", updateBook)
    .delete("/:id", deleteBook);

export default bookRouter;
