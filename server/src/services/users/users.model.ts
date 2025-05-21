import { Request, Response } from 'express';
import DB from "../../utils/DB";
import { AdminUser, User } from "./users.types";

export default class UserModel {

    static async createUser(req: Request, res: Response) {
         try {
            let user = req.body as User | AdminUser;

            if (!user)
                res.status(400).json({ message: 'User data is required' });

            if (!user.email || !user.password)
                res.status(400).json({ message: 'Email and password are required' });

            let registeredUser = await new DB().AddDocument('users', user);

            res.status(201).json({
                message: 'User registered successfully',
                user: registeredUser
            });

        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getUserById(userId: string) {
        
    }
    

} 