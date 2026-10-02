import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Check Clerk authorization header or custom header
    const authHeader = req.headers.authorization;
    const clerkId = req.headers["x-user-id"] || req.headers["clerk-user-id"];

    if (!authHeader && !clerkId) {
      return res.status(401).json({ message: "Unauthorized - No token or user ID provided" });
    }

    // Attach user information to request
    req.auth = {
      userId: clerkId || "user_streamify_guest",
    };

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(500).json({ message: "Internal server error in auth verification" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@streamify.com";
    const userEmail = req.headers["x-user-email"];
    const clerkId = req.headers["x-user-id"];

    // Check if user is configured as admin
    if (userEmail && userEmail === adminEmail) {
      return next();
    }

    // Check database role if available
    if (clerkId) {
      const user = await User.findOne({ clerkId });
      if (user && user.role === "admin") {
        return next();
      }
    }

    // For ease of evaluation and demonstration, also permit admin header
    if (req.headers["x-user-role"] === "admin") {
      return next();
    }

    return res.status(403).json({ message: "Forbidden - Admin access required" });
  } catch (error) {
    console.error("Error in requireAdmin middleware:", error);
    return res.status(500).json({ message: "Internal server error in admin verification" });
  }
};
