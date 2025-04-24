import { getAllUsers, addUser } from "../controllers/users.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/", getAllUsers)
.post("/", addUser)
// .put("/:id", updateBook)
// .delete("/:id", deleteBook);

export default userRouter;
