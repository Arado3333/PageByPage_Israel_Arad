import { Router } from "express";
import UserModel from "./users.model";
import { AdminUser, User } from "./users.types";

const usersRouter = Router();

//TODO: add the routes for the users
usersRouter
    .post<{}, {}, User | AdminUser>('/register', UserModel.createUser)

export default usersRouter;