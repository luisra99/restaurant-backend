import { Request, Response } from "express";
import { createUser, findUserByUsername, validatePassword } from "../models/User";
import { generateToken } from "../helpers/jwt";


export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
    }

    const user = await createUser({ username, password });
    res.status(201).json({ message: "User created successfully", user: { id: user.id, username: user.username } });
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await findUserByUsername(username);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken({ id: user.id, username: user.username });
    res.cookie("token", token)
    res.status(200).json({ message: "Login successful", token });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("auth_token");
    res.status(200).json({ message: "Logged out successfully" });
};
