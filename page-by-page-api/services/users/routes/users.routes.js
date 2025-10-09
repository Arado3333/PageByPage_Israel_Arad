import { isAdmin, authenticateToken } from "../../../middlewares/auth.js";
import {
  getAllUsers,
  getUserProfile,
  addUser,
  login,
  loginNative,
  updateUserDetails,
} from "../controllers/users.controller.js";
import { Router } from "express";

const userRouter = Router();

userRouter
  .get("/", isAdmin, getAllUsers)
  .get("/profile/:userId", authenticateToken, getUserProfile)
  .post("/", addUser)
  .post("/login", login)
  .post("/loginNative", loginNative)
  .put("/:id", updateUserDetails)
  .get("/profile", authenticateToken, getUserProfile);
// .delete("/:id", deleteUser);

export default userRouter;
