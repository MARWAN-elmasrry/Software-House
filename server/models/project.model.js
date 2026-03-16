import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    client: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be less than 0"],
    },
    // ─── Web plan add-on: include a mobile app ───────────
    mobileAddon: {
      type: Boolean,
      default: false,
    },
    // ─── AI plan add-on: include a web project ───────────
    webAddon: {
      type: Boolean,
      default: false,
    },
    // ─── which service section this project belongs to ───
    section: {
      type: String,
      enum: {
        values: ["web", "ai", "embedded", "3d"],
        message: 'Section must be "web", "ai", "embedded", or "3d"',
      },
      required: [true, "Section is required"],
    },
    due: {
      type: String,
      required: [true, "Due date is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "review", "done"],
        message: 'Status must be "active", "review", or "done"',
      },
      default: "active",
    },
    progress: {
      type: Number,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"],
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

projectSchema.pre("save", function (next) {
  if (this.progress === 100) {
    this.status = "done";
  }
  next();
});

projectSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.progress === 100) {
    update.status = "done";
  }
  next();
});

export default mongoose.model("Project", projectSchema);