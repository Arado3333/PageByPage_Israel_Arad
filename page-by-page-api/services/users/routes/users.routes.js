import { isAdmin } from "../../../middlewares/auth.js";
import { getAllUsers, addUser, login } from "../controllers/users.controller.js";
import { Router } from "express";

const userRouter = Router();

userRouter
.get("/", isAdmin ,getAllUsers)
.post("/", addUser)
.post("/login", login)
// .put("/:id", updateBook)
// .delete("/:id", deleteBook);

export default userRouter;
