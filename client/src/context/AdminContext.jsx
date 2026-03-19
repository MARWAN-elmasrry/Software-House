import { createContext, useContext, useState, useCallback } from "react";

// ─── Role → allowed sections map (mirrors server/models/admin.model.js) ───────
export const ROLE_PERMISSIONS = {
  superadmin: ["web", "ai", "3d", "embedded"],
  web_ai:     ["web", "ai"],
  custom:     [], // Custom role uses allowedSections from admin data
};

const AdminContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AdminProvider = ({ children }) => {
  // admin shape: { id, username, role, allowedSections, token }
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("admin_session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((adminData, token) => {
    const session = { ...adminData, token };
    setAdmin(session);
    localStorage.setItem("admin_session", JSON.stringify(session));
    // Also store token separately for easy access in API calls
    localStorage.setItem("adminToken", token);
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem("admin_session");
    localStorage.removeItem("adminToken");
  }, []);

  // Check if the current admin can access a section
  // Priority: allowedSections (if present) > role-based permissions
  const canAccess = useCallback(
    (section) => {
      if (!admin) return false;
      
      // If admin has explicit allowedSections, use those
      if (admin.allowedSections && Array.isArray(admin.allowedSections)) {
        return admin.allowedSections.includes(section);
      }
      
      // Fallback to role-based permissions
      return (ROLE_PERMISSIONS[admin.role] ?? []).includes(section);
    },
    [admin]
  );

  // Get all allowed sections for the current admin
  const getAllowedSections = useCallback(() => {
    if (!admin) return [];
    
    // If admin has explicit allowedSections, use those
    if (admin.allowedSections && Array.isArray(admin.allowedSections)) {
      return admin.allowedSections;
    }
    
    // Fallback to role-based permissions
    return ROLE_PERMISSIONS[admin.role] ?? [];
  }, [admin]);

  // Check if current admin is superadmin
  const isSuperAdmin = admin?.role === "superadmin";

  return (
    <AdminContext.Provider
      value={{ 
        admin, 
        login, 
        logout, 
        canAccess, 
        getAllowedSections,
        isSuperAdmin 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
};