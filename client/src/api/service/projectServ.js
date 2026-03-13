    import api from "../axios.js";

// ─── GET /api/projects ────────────────────────────────────────────────────────

export const getAllProjects = async (params = {}) => {
  try {
    const response = await api.get("/projects", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error fetching projects";
  }
};

// ─── GET /api/projects/stats ──────────────────────────────────────────────────

export const getProjectStats = async () => {
  try {
    const response = await api.get("/projects/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error fetching stats";
  }
};

// ─── GET /api/projects/:id ────────────────────────────────────────────────────

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error fetching project";
  }
};

// ─── POST /api/projects ───────────────────────────────────────────────────────

export const createProject = async (data) => {
  try {
    const response = await api.post("/projects", data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error creating project";
  }
};

// ─── PUT /api/projects/:id ────────────────────────────────────────────────────

export const updateProject = async (id, data) => {
  try {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error updating project";
  }
};

// ─── PATCH /api/projects/:id ──────────────────────────────────────────────────

export const patchProject = async (id, data) => {
  try {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error patching project";
  }
};

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Error deleting project";
  }
};