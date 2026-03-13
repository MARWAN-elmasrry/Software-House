import Project from "../models/project.model.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

const sendError = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, error: message });

// ─── GET /api/projects ────────────────────────────────────────────────────────

export const getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, sort = "-createdAt" } = req.query;

    const filter = {};
    if (status) {
      const allowed = ["active", "review", "done"];
      if (!allowed.includes(status)) {
        return sendError(res, `Invalid status. Must be one of: ${allowed.join(", ")}`);
      }
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: projects,
    });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

// ─── GET /api/projects/stats ──────────────────────────────────────────────────

export const getStats = async (req, res) => {
  try {
    const [counts, avgProgress] = await Promise.all([
      Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Project.aggregate([{ $group: { _id: null, avg: { $avg: "$progress" } } }]),
    ]);

    const stats = { active: 0, review: 0, done: 0, total: 0 };
    counts.forEach(({ _id, count }) => {
      stats[_id] = count;
      stats.total += count;
    });
    stats.averageProgress = avgProgress[0]?.avg
      ? Math.round(avgProgress[0].avg)
      : 0;

    sendSuccess(res, stats);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

// ─── GET /api/projects/:id ────────────────────────────────────────────────────

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, "Project not found", 404);
    sendSuccess(res, project);
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid project ID format", 400);
    sendError(res, error.message, 500);
  }
};

// ─── POST /api/projects ───────────────────────────────────────────────────────

export const createProject = async (req, res) => {
  try {
    const { name, client, due, status, progress } = req.body;
    const project = await Project.create({ name, client, due, status, progress });
    sendSuccess(res, project, 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return sendError(res, messages.join(". "), 422);
    }
    sendError(res, error.message, 500);
  }
};

// ─── PUT /api/projects/:id ────────────────────────────────────────────────────

export const updateProject = async (req, res) => {
  try {
    const { name, client, due, status, progress } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, client, due, status, progress },
      { new: true, runValidators: true }
    );
    if (!project) return sendError(res, "Project not found", 404);
    sendSuccess(res, project);
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid project ID format", 400);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return sendError(res, messages.join(". "), 422);
    }
    sendError(res, error.message, 500);
  }
};

// ─── PATCH /api/projects/:id ──────────────────────────────────────────────────

export const patchProject = async (req, res) => {
  try {
    const allowed = ["name", "client", "due", "status", "progress"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0)
      return sendError(res, "No valid fields provided for update");

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!project) return sendError(res, "Project not found", 404);
    sendSuccess(res, project);
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid project ID format", 400);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return sendError(res, messages.join(". "), 422);
    }
    sendError(res, error.message, 500);
  }
};

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return sendError(res, "Project not found", 404);
    sendSuccess(res, { message: "Project deleted successfully", id: req.params.id });
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid project ID format", 400);
    sendError(res, error.message, 500);
  }
};