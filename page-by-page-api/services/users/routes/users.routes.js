import { isAdmin } from "../../../middlewares/auth.js";
import { getAllUsers, addUser, login, updateUserDetails } from "../controllers/users.controller.js";
import { Router } from "express";

const userRouter = Router();

userRouter
.get("/", isAdmin ,getAllUsers)
.post("/", addUser)
.post("/login", login)
.put("/:id", updateUserDetails)
// .delete("/:id", deleteBook);

export default userRouter;
 
