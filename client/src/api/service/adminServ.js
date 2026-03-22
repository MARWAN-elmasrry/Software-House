import api from "../axios.js";

// ─── Helper function to get auth headers ──────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  
  if (!token) {
    console.warn("⚠️ No admin token found in localStorage");
  }
  
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// ─── Contact & Stats endpoints ────────────────────────────────────────────────

export const GetContact = async () => {
  try {
    const response = await api.get("/contact", getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("GetContact error:", error);
    throw error.response?.data?.message || error.message || "Error fetching contacts";
  }
};

export const getStats = async () => {
  try {
    const res = await api.get("/projects/stats", getAuthHeaders());
    
    if (!res.data.success) {
      throw new Error(res.data.error);
    }

    return res.data;
  } catch (error) {
    console.error("getStats error:", error);
    throw error;
  }
};

// ─── Admin Management endpoints ───────────────────────────────────────────────

// GET /api/admin/list
export const getAllAdmins = async () => {
  try {
    
    const token = localStorage.getItem("adminToken");
    
    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }
    
    const response = await api.get("/admin/list", getAuthHeaders());
    
    
    // Handle different response formats
    if (response.data.success === false) {
      throw new Error(response.data.error || "Failed to fetch admins");
    }
    
    // If response.data.data exists, use it; otherwise use response.data directly
    const admins = response.data.data || response.data;
    
    
    return admins;
  } catch (error) {
    console.error("❌ getAllAdmins error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    
    // Better error messages
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("Access denied. Superadmin role required.");
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(error.message || "Failed to fetch admins");
    }
  }
};

// POST /api/admin/create
export const createAdmin = async (adminData) => {
  try {
    
    const response = await api.post("/admin/create", adminData, getAuthHeaders());
    
    
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ createAdmin error:", error);
    console.error("Error response:", error.response?.data);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || "Failed to create admin");
  }
};

// PUT /api/admin/:id
export const updateAdmin = async (adminId, adminData) => {
  try {
    
    const response = await api.put(`/admin/${adminId}`, adminData, getAuthHeaders());
    
    
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ updateAdmin error:", error);
    console.error("Error response:", error.response?.data);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || "Failed to update admin");
  }
};

// DELETE /api/admin/:id
export const deleteAdmin = async (adminId) => {
  try {
    
    const response = await api.delete(`/admin/${adminId}`, getAuthHeaders());
    
    
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ deleteAdmin error:", error);
    console.error("Error response:", error.response?.data);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || "Failed to delete admin");
  }
};

// PATCH /api/admin/:id/toggle-status
export const toggleAdminStatus = async (adminId) => {
  try {
    
    const response = await api.patch(
      `/admin/${adminId}/toggle-status`,
      {},
      getAuthHeaders()
    );
    
    
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ toggleAdminStatus error:", error);
    console.error("Error response:", error.response?.data);
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || "Failed to toggle admin status");
  }
};