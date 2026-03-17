import api from "../axios.js";

// ─── POST /api/admin/login ────────────────────────────────────────────────────

export const loginAdmin = async ({ username, password }) => {
  try {
    const response = await api.post("/admin/login", { username, password });
    return response.data; // { success, data: { token, admin } }
  } catch (error) {
    throw error.response?.data?.error || error.message || "Login failed";
  }
};

// ─── GET /api/admin/me ────────────────────────────────────────────────────────

export const getAdminMe = async (token) => {
  try {
    const response = await api.get("/admin/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Failed to fetch admin";
  }
};

// ─── GET /api/admin/permissions ───────────────────────────────────────────────

export const getAdminPermissions = async (token) => {
  try {
    const response = await api.get("/admin/permissions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || "Failed to fetch permissions";
  }
};
