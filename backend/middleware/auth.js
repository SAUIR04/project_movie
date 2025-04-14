import jwt from "jsonwebtoken";
import RevokedToken from "../models/token.js";

//Authentication middleware

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.header('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    try {
        //check if token is revoked
        const revoked = await RevokedToken.exists({ token });
        if (revoked) {
            return res.status(403).json({ success: false, message: 'Token is revoked' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ success: false, message: 'Invalid Token' });
            req.user = user;
            next();
        });
    } catch (error) {
        console.log("Unexpected error in authentication middleware: " + error);
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }

};
//Admin role check middleware
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
}
