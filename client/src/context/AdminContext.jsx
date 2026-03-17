import { createContext, useContext, useState, useCallback } from "react";

// ─── Role → allowed sections map (mirrors server/models/admin.model.js) ───────
export const ROLE_PERMISSIONS = {
  superadmin: ["web", "ai", "3d", "embedded"],
  web_ai:     ["web", "ai"],
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
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem("admin_session");
  }, []);

  // Check if the current admin can access a section
  const canAccess = useCallback(
    (section) => {
      if (!admin) return false;
      return (ROLE_PERMISSIONS[admin.role] ?? []).includes(section);
    },
    [admin]
  );

  // Check if current admin is superadmin
  const isSuperAdmin = admin?.role === "superadmin";

  return (
    <AdminContext.Provider
      value={{ admin, login, logout, canAccess, isSuperAdmin }}
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
