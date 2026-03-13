import api from "../axios.js";

// ─── GET /api/blogs ───────────────────────────────────────────────────────────

export const getAllBlogs = async (params = {}) => {
  try {
    const response = await api.get("/blogs", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error fetching blog projects";
  }
};

// ─── GET /api/blogs/stats ─────────────────────────────────────────────────────

export const getBlogStats = async () => {
  try {
    const response = await api.get("/blogs/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error fetching stats";
  }
};

// ─── GET /api/blogs/:id ───────────────────────────────────────────────────────

export const getBlogById = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error fetching blog project";
  }
};

// ─── POST /api/blogs ──────────────────────────────────────────────────────────

export const createBlog = async (data) => {
  try {
    const response = await api.post("/blogs", data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error creating blog project";
  }
};

// ─── PUT /api/blogs/:id ───────────────────────────────────────────────────────

export const updateBlog = async (id, data) => {
  try {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error updating blog project";
  }
};

// ─── PATCH /api/blogs/:id ─────────────────────────────────────────────────────

export const patchBlog = async (id, data) => {
  try {
    const response = await api.patch(`/blogs/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error patching blog project";
  }
};

// ─── PATCH /api/blogs/:id/toggle-important ────────────────────────────────────

export const toggleImportant = async (id) => {
  try {
    const response = await api.patch(`/blogs/${id}/toggle-important`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error toggling featured status";
  }
};

// ─── DELETE /api/blogs/:id ────────────────────────────────────────────────────

export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error deleting blog project";
  }
};