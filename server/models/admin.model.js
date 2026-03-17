import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ─── Allowed sections per role ────────────────────────────────────────────────
export const ROLE_PERMISSIONS = {
  superadmin: ["web", "ai", "3d", "embedded"],
  web_ai:     ["web", "ai"],
};

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ["superadmin", "web_ai"],
        message: 'Role must be "superadmin" or "web_ai"',
      },
      default: "web_ai",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─── Hash password before saving ─────────────────────────────────────────────
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare passwords ──────────────────────────────────────
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Instance method: get allowed sections ───────────────────────────────────
adminSchema.methods.getAllowedSections = function () {
  return ROLE_PERMISSIONS[this.role] ?? [];
};

// ─── Instance method: check section access ───────────────────────────────────
adminSchema.methods.canAccess = function (section) {
  return (ROLE_PERMISSIONS[this.role] ?? []).includes(section);
};

export default mongoose.model("Admin", adminSchema);
