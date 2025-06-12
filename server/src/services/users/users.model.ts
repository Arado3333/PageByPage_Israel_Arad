//API Controller
import { Request, Response } from "express";
import DB from "../../utils/DB";
import { AdminUser, User, UserWithoutPassword } from "./users.types";
import bcrypt from "bcrypt";

export default class UserModel {
    static async createUser(req: Request, res: Response) {
        try {
            let user = req.body as User | AdminUser;

            if (!user)
                res.status(400).json({ message: "User data is required" });

            if (!user.email || !user.password)
                res.status(400).json({
                    message: "Email and password are required",
                });

            let registeredUser = await new DB().AddDocument("Users", user);

            res.status(201).json({
                message: "User registered successfully",
                user: registeredUser,
            });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getUserById(userId: string) {
        let db = new DB();
        let user = await db.GetDocumentById("Users", userId);
        return user;
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const db = new DB();
            let user = await db.GetDocumentByEmail("Users", email);

            if (!user || bcrypt.compareSync(password, user.password) === false) {
                return null;
            }
            delete user.password;
            return user;
        } catch (error) {
            throw new Error("Error occured at login");
        }
    }
}
