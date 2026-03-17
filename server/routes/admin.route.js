import { Router } from "express";
import {
  loginAdmin,
  getMe,
  getPermissions,
  seedAdmins,
  listAdmins,
} from "../controller/admin.controller.js";
import { protect, requireSuperAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// ── Public ───────────────────────────────────────────────
router.post("/login", loginAdmin);

// ── One-time seed (REMOVE in production) ────────────────
router.post("/seed", seedAdmins);

// ── Protected ────────────────────────────────────────────
router.get("/me", protect, getMe);
router.get("/permissions", protect, getPermissions);

// ── Superadmin only ──────────────────────────────────────
router.get("/list", protect, requireSuperAdmin, listAdmins);

export default router;
