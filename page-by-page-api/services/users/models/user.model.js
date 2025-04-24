import { getAll, getUserByEmail } from "../config/users.db";
import bcrypt from "bcryptjs";

export default class User {
    constructor({ name, email, password }) {
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
            if (!user && bcrypt.compareSync(password, this.password) == false) {
                return null;
            }
            delete this.password;
            return user;
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
