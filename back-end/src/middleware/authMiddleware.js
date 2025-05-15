// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Check if the Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    // Extract the token
    const token = authHeader.split(" ")[1];
    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user data to the request object
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;