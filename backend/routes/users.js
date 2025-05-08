import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import RevokedToken from "../models/token.js";
import { authenticateToken, adminOnly } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();



//login endpoint remains the same
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide username and password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePasswords(password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});
//Register endpoint

router.post("/register", async (req, res) => {
    
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide username and password" });
    }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Registration failed:", error);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
});
//Logout endpoint

router.post("/logout", async (req, res) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (token) {
    try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
            await RevokedToken.create({ token, expiresAt: new Date(decoded.exp * 1000) });
        }
        res.json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        console.error("logout error:", error);
        res.status(500).json({ success: false, message: "Logout failed" });
    }
    } else {
        res.status(404).json({ success: false, message: "No token provided" });
    }
 });
 //ADMIN PANEL ENDPOINT
    router.get("/admin", authenticateToken, adminOnly, (req, res) => {
        res.json({ success: true, message: "Welcome to admin panel" });
    });

    export default router;