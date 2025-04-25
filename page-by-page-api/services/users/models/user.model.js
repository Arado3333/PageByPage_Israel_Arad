import bcrypt from "bcryptjs";
import { ROLES } from "../../../global.js";
import { getAll, getUserByEmail, createUser } from "../config/users.db.js";

export default class User {
    constructor({ name, email, password, role =  ROLES.USER }) {
        this.role = role; // Default role is 'user'
        this.name = name;
        this.email = email;
        this.password = bcrypt.hashSync(password, 15);
    }

    static async getAllUsers() {
        try {
            return await getAll();
        } catch (error) {
            throw new Error("An error occured while fetching users");
        }
    }

    static async login(email, password) {
        try {
            let user = await getUserByEmail(email);
            if (!user || bcrypt.compareSync(password, user.password) === false) {
                return null;
            }
            delete this.password; // Remove password from user object before returning
            return user; // Return the user object without the password
        } catch (error) {
            throw new Error("Error occured at login");
        }
    }

    async save() {
        try {
            return await createUser(this);
        } catch (error) {
            throw new Error("An error occurred while saving the user.");
        }
    }
}
