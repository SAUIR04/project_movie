import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import RevokedToken from "../models/token.js";
import { authenticateToken, adminOnly } from "../middleware/auth.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Маршрут для логина
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Маршрут для страницы Index (Требуется аутентификация)
router.get("/index", authenticateToken, adminOnly, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});



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
        res.status(500).json({ success: false, message: "Login failed" });
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