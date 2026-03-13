import Blog from "../models/blog.model.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

const sendError = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, error: message });

// ─── GET /api/blogs ───────────────────────────────────────────────────────────

export const getAllBlogs = async (req, res) => {
  try {
    const { important, page = 1, limit = 20, sort = "-createdAt" } = req.query;

    const filter = {};
    if (important !== undefined) {
      filter.important = important === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Blog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: blogs,
    });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

// ─── GET /api/blogs/stats ─────────────────────────────────────────────────────

export const getStats = async (req, res) => {
  try {
    const [total, featured] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ important: true }),
    ]);

    sendSuccess(res, { total, featured });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

// ─── GET /api/blogs/:id ───────────────────────────────────────────────────────

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return sendError(res, "Blog project not found", 404);
    sendSuccess(res, blog);
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid ID format", 400);
    sendError(res, error.message, 500);
  }
};

// ─── POST /api/blogs ──────────────────────────────────────────────────────────

export const createBlog = async (req, res) => {
  try {
    const { title, description, image, link, important } = req.body;
    const blog = await Blog.create({ title, description, image, link, important });
    sendSuccess(res, blog, 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return sendError(res, messages.join(". "), 422);
    }
    sendError(res, error.message, 500);
  }
};

// ─── PUT /api/blogs/:id ───────────────────────────────────────────────────────

export const updateBlog = async (req, res) => {
  try {
    const { title, description, image, link, important } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, image, link, important },
      { new: true, runValidators: true }
    );
    if (!blog) return sendError(res, "Blog project not found", 404);
    sendSuccess(res, blog);
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid ID format", 400);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return sendError(res, messages.join(". "), 422);
    }
    sendError(res, error.message, 500);
  }
};

// ─── PATCH /api/blogs/:id ─────────────────────────────────────────────────────

export const patchBlog = async (req, res) => {
  try {
    const allowed = ["title", "description", "image", "link", "important"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0)
      return sendError(res, "No valid fields provided for update");

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!blog) return sendError(res, "Blog project not found", 404);
    sendSuccess(res, blog);
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid ID format", 400);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return sendError(res, messages.join(". "), 422);
    }
    sendError(res, error.message, 500);
  }
};

// ─── PATCH /api/blogs/:id/toggle-important ────────────────────────────────────

export const toggleImportant = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return sendError(res, "Blog project not found", 404);

    blog.important = !blog.important;
    await blog.save();

    sendSuccess(res, blog);
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid ID format", 400);
    sendError(res, error.message, 500);
  }
};

// ─── DELETE /api/blogs/:id ────────────────────────────────────────────────────

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return sendError(res, "Blog project not found", 404);
    sendSuccess(res, { message: "Blog project deleted successfully", id: req.params.id });
  } catch (error) {
    if (error.name === "CastError")
      return sendError(res, "Invalid ID format", 400);
    sendError(res, error.message, 500);
  }
};