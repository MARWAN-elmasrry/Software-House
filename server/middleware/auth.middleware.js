import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

// ─── protect ─────────────────────────────────────────────────────────────────
// Verifies JWT and attaches the full admin document (with role) to req.admin

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // fetch admin WITHOUT password, but WITH role & isActive
      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res
          .status(401)
          .json({ success: false, error: "Not authorized, admin not found" });
      }

      if (!req.admin.isActive) {
        return res
          .status(403)
          .json({ success: false, error: "Account deactivated" });
      }

      return next();
    } catch (error) {
      console.error("protect middleware error:", error.message);
      return res
        .status(401)
        .json({ success: false, error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, no token" });
  }
};

// ─── requireSuperAdmin ────────────────────────────────────────────────────────
// Use AFTER protect. Blocks anyone who is not superadmin.

export const requireSuperAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== "superadmin") {
    return res
      .status(403)
      .json({ success: false, error: "Forbidden: superadmin access required" });
  }
  next();
};

// ─── requireSectionAccess ────────────────────────────────────────────────────
// Factory middleware — use AFTER protect.
// Usage: router.get("/3d", protect, requireSectionAccess("3d"), handler)

export const requireSectionAccess = (section) => (req, res, next) => {
  if (!req.admin || !req.admin.canAccess(section)) {
    return res.status(403).json({
      success: false,
      error: `Forbidden: your role does not have access to the "${section}" section`,
    });
  }
  next();
};
