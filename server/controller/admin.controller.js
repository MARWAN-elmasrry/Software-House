import jwt from "jsonwebtoken";
import Admin, { ROLE_PERMISSIONS } from "../models/admin.model.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

const sendError = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, error: message });

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// ─── POST /api/admin/login ────────────────────────────────────────────────────

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendError(res, "Username and password are required", 400);
    }

    // find admin and include password for comparison
    const admin = await Admin.findOne({ username: username.toLowerCase().trim() }).select(
      "+password"
    );

    if (!admin) {
      return sendError(res, "Invalid credentials", 401);
    }

    if (!admin.isActive) {
      return sendError(res, "Account is deactivated. Contact super admin.", 403);
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return sendError(res, "Invalid credentials", 401);
    }

    // update last login timestamp
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id);

    sendSuccess(res, {
      token,
      admin: {
        id:               admin._id,
        username:         admin.username,
        role:             admin.role,
        allowedSections:  admin.getAllowedSections(),
        lastLogin:        admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("loginAdmin error:", error);
    sendError(res, "Server error during login", 500);
  }
};

// ─── GET /api/admin/me  (protected) ──────────────────────────────────────────

export const getMe = async (req, res) => {
  try {
    const admin = req.admin; // set by protect middleware
    sendSuccess(res, {
      id:              admin._id,
      username:        admin.username,
      role:            admin.role,
      allowedSections: admin.getAllowedSections(),
      isActive:        admin.isActive,
      lastLogin:       admin.lastLogin,
    });
  } catch (error) {
    sendError(res, "Server error", 500);
  }
};

// ─── GET /api/admin/permissions (protected) ──────────────────────────────────
// Returns the full role→sections map (useful for frontend context)

export const getPermissions = async (req, res) => {
  try {
    sendSuccess(res, {
      role:            req.admin.role,
      allowedSections: req.admin.getAllowedSections(),
      allRoles:        ROLE_PERMISSIONS,
    });
  } catch (error) {
    sendError(res, "Server error", 500);
  }
};

// ─── POST /api/admin/seed  ────────────────────────────────────────────────────
// One-time seeder: creates default admins if none exist. Remove in production.

export const seedAdmins = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      return sendError(res, "Admins already seeded. Remove this endpoint in production.", 409);
    }

    // Use .save() instead of insertMany so the pre-save bcrypt hook runs
    await new Admin({ username: "admin",    password: "admin123", role: "superadmin" }).save();
    await new Admin({ username: "webadmin", password: "web12345", role: "web_ai"     }).save();

    sendSuccess(res, { message: "Default admins created successfully." }, 201);
  } catch (error) {
    console.error("seedAdmins error:", error);
    sendError(res, "Seeding failed: " + error.message, 500);
  }
};

// ─── GET /api/admin/list  (superadmin only) ───────────────────────────────────

export const listAdmins = async (req, res) => {
  try {
    if (req.admin.role !== "superadmin") {
      return sendError(res, "Forbidden: superadmin only", 403);
    }
    const admins = await Admin.find().select("-password");
    sendSuccess(res, admins);
  } catch (error) {
    sendError(res, "Server error", 500);
  }
};