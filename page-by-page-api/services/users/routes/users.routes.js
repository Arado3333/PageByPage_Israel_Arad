import { isAdmin, authenticateToken } from "../../../middlewares/auth.js";
import {
  getAllUsers,
  addUser,
  login,
  loginNative,
  updateUserDetails,
} from "../controllers/users.controller.js";
import { Router } from "express";

const userRouter = Router();

userRouter
  .get("/", isAdmin, getAllUsers)
  .post("/", addUser)
  .post("/login", login)
  .post("/loginNative", loginNative)
  .put("/:id", updateUserDetails)
  // Example of a protected route that requires authentication
  .get("/profile", authenticateToken, (req, res) => {
    res.json({
      message: "Profile accessed successfully",
      user: req.user,
    });
  });
// .delete("/:id", deleteBook);

export default userRouter;
