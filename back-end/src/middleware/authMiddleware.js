// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const authMiddleware = (requireAdmin = false) => async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // If admin is required, check user role from DB
    if (requireAdmin) {
      const user = await UserModel.findById(decoded.id);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required 🚫" });
      }
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
