import bcrypt from "bcryptjs";
import { ROLES } from "../../../global.js";
import {
    getAll,
    getUserByEmail,
    createUser,
    updateUser,
} from "../config/users.db.js";

export default class User {
    constructor(name, email, password, role = ROLES.USER, bio = "") {
        this.role = role; // Default role is 'user'
        this.name = name;
        this.email = email;
        this.password = bcrypt.hashSync(password, 15);
        this.bio = bio;
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
            if (
                !user ||
                bcrypt.compareSync(password, user.password) === false
            ) {
                return null;
            }
            delete this.password; // Remove password from user object before returning
            return user; // Return the user object without the password
        } catch (error) {
            throw new Error("Error occured at login");
        }
    }

    clearEmptyFields()
    {
        if (this.name === "" || this.name === undefined) { delete this.name;}
        if (this.email === "" || this.email === undefined) { delete this.email;}
        if (this.password === "" || this.password === undefined) { delete this.password;}
    }

    static async getUserByEmail(email) {
        return await getUserByEmail(email);
    }

    async updateDetails(id) {
        console.log("model..");
        
        try {
            return await updateUser(id, this);
        } catch (error) {
            throw new Error("Error updating user details");
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

