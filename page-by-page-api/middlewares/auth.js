import jwt from "jsonwebtoken";
import { ROLES, PERMISSIONS, JWT_SECRET } from "../global.js";

// General authentication middleware
export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied: No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res
      .status(500)
      .json({ message: "An error occurred while verifying token" });
  }
}

// Admin-only middleware
export async function isAdmin(req, res, next) {
  try {
    console.log("Checking admin status...");
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Forbidden: No token provided" });
    }

    const user = jwt.verify(token, JWT_SECRET);

    if (user && user.role === ROLES.ADMIN) {
      req.user = user; // Add user info to request object
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Admins only" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res
      .status(500)
      .json({ message: "An error occurred while checking admin status." });
  }
}

// Permission-based middleware
export function hasPermission(permission) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res
          .status(403)
          .json({ message: "Forbidden: No token provided" });
      }

      const user = jwt.verify(token, JWT_SECRET);

      // Admin has all permissions
      if (user.role === ROLES.ADMIN) {
        req.user = user;
        return next();
      }

      // Check if user has specific permission
      if (user.permissions && user.permissions.includes(permission)) {
        req.user = user;
        return next();
      }

      res.status(403).json({
        message: `Forbidden: Missing permission '${permission}'`,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.status(500).json({
        message: "An error occurred while checking permissions.",
      });
    }
  };
}

// Utility functions for permission checks
export const canCreateUser = hasPermission(PERMISSIONS.CREATE_USER);
export const canDeleteUser = hasPermission(PERMISSIONS.DELETE_USER);
export const canEditUser = hasPermission(PERMISSIONS.EDIT_USER);
export const canViewLogs = hasPermission(PERMISSIONS.VIEW_LOGS);
export const canManageAISettings = hasPermission(
  PERMISSIONS.MANAGE_AI_SETTINGS
);
export const canManageSystemSettings = hasPermission(
  PERMISSIONS.MANAGE_SYSTEM_SETTINGS
);
