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

// Auto-set status to "done" if progress hits 100
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