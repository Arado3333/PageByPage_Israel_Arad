import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ObjectId } from "mongodb";

export async function getAllUsers(req, res) {
    try {
        const users = await User.getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching users.",
        });
    }
}

export async function addUser(req, res) {
    try {
        const {email, name, password} = req.body;
        
        let user = new User(name, email, password);
        const result = await user.save();
        res.status(201).json({
            message: "User created successfully",
            user: result,
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "An error occurred while creating the user.",
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.login(email, password);

        if (user) {
            res.status(200).json({
                message: "Login successful",
                token: jwt.sign(user, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                    algorithm: "HS256",
                }),
                userID: user._id
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login." });
    }
}

export async function updateUserDetails(req, res) {
    console.log(req.body);
    console.log(req.params);

    const { name, email, newPassword, role, bio } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    const updatedUser = new User(name, email, newPassword, role, bio);
    updatedUser.clearEmptyFields();

    try {
        const result = await updatedUser.updateDetails(id);
        return res
            .status(200)
            .json({
                result: result,
                message: "Successfuly updated details",
                success: true
            });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating the user details",
            success: false
        });
    }
}
