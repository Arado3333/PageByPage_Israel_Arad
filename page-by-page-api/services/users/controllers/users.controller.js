import User from "../models/user.model.js";

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
        const user = new User(req.body);
        const result = await user.save();
        res.status(201).json({
            message: "User created successfully",
            user: result,
        });
    } catch (error) {
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
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login." });
    }
}
