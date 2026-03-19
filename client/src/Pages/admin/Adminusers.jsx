import { useEffect, useState } from "react";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  toggleAdminStatus,
} from "../../api/service/adminServ";
import "./adminUsers.css";

const AVAILABLE_SECTIONS = ["web", "ai", "3d", "embedded"];

const ROLE_OPTIONS = [
  { value: "superadmin", label: "Superadmin", description: "Full access to everything" },
  { value: "web_ai", label: "Web + AI", description: "Access to Web and AI sections" },
  { value: "custom", label: "Custom", description: "Select specific sections" },
];

// ─── Create Modal ─────────────────────────────────────────
const CreateModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "custom",
    allowedSections: [],
    isActive: true,
  });
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleSection = (section) => {
    setForm((prev) => ({
      ...prev,
      allowedSections: prev.allowedSections.includes(section)
        ? prev.allowedSections.filter((s) => s !== section)
        : [...prev.allowedSections, section],
    }));
  };

  const handleSubmit = async () => {
    if (!form.username.trim()) {
      setError("Username is required");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Validate sections for custom role
    if (form.role === "custom" && form.allowedSections.length === 0) {
      setError("Please select at least one section");
      return;
    }

    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create admin");
    }
  };

  return (
    <div className="au-overlay" onClick={onClose}>
      <div className="au-modal" onClick={(e) => e.stopPropagation()}>
        <div className="au-modal__header">
          <h2>Create New Admin</h2>
          <button className="au-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="au-modal__body">
          {error && <div className="au-error">{error}</div>}

          <label className="au-field">
            <span>Username</span>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Enter username"
              autoFocus
            />
          </label>

          <label className="au-field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </label>

          <div className="au-field">
            <span>Role</span>
            <div className="au-role-options">
              {ROLE_OPTIONS.map((option) => (
                <label key={option.value} className="au-role-option">
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={form.role === option.value}
                    onChange={(e) => {
                      handleChange("role", e.target.value);
                      // Auto-set sections based on role
                      if (e.target.value === "superadmin") {
                        handleChange("allowedSections", ["web", "ai", "3d", "embedded"]);
                      } else if (e.target.value === "web_ai") {
                        handleChange("allowedSections", ["web", "ai"]);
                      } else {
                        handleChange("allowedSections", []);
                      }
                    }}
                  />
                  <div>
                    <div className="au-role-label">{option.label}</div>
                    <div className="au-role-description">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Show section checkboxes for custom role */}
          {form.role === "custom" && (
            <div className="au-field">
              <span>Allowed Sections</span>
              <div className="au-sections">
                {AVAILABLE_SECTIONS.map((section) => (
                  <label key={section} className="au-checkbox">
                    <input
                      type="checkbox"
                      checked={form.allowedSections.includes(section)}
                      onChange={() => toggleSection(section)}
                    />
                    <span>{section.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Show read-only sections for superadmin and web_ai */}
          {form.role !== "custom" && (
            <div className="au-field">
              <span>Allowed Sections</span>
              <div className="au-sections-readonly">
                {form.allowedSections.map((section) => (
                  <span key={section} className="au-section-tag">
                    {section.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <label className="au-field">
            <span>Status</span>
            <select
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) => handleChange("isActive", e.target.value === "active")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="au-modal__footer">
          <button className="au-btn au-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="au-btn au-btn--primary" onClick={handleSubmit}>
            Create Admin
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────
const EditModal = ({ admin, onClose, onSave }) => {
  const [form, setForm] = useState({
    role: admin.role,
    allowedSections: admin.allowedSections || [],
    isActive: admin.isActive,
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleSection = (section) => {
    setForm((prev) => ({
      ...prev,
      allowedSections: prev.allowedSections.includes(section)
        ? prev.allowedSections.filter((s) => s !== section)
        : [...prev.allowedSections, section],
    }));
  };

  const handleSubmit = async () => {
    // Validate sections for custom role
    if (form.role === "custom" && form.allowedSections.length === 0) {
      setError("Please select at least one section");
      return;
    }

    try {
      const updates = {
        role: form.role,
        allowedSections: form.allowedSections,
        isActive: form.isActive,
      };
      
      // Only include password if it was changed
      if (form.password && form.password.trim()) {
        if (form.password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }
        updates.password = form.password;
      }

      await onSave(admin.id, updates);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update admin");
    }
  };

  return (
    <div className="au-overlay" onClick={onClose}>
      <div className="au-modal" onClick={(e) => e.stopPropagation()}>
        <div className="au-modal__header">
          <h2>Edit Admin</h2>
          <button className="au-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="au-modal__body">
          {error && <div className="au-error">{error}</div>}

          <div className="au-field au-field--readonly">
            <span>Username</span>
            <p>{admin.username}</p>
          </div>

          <label className="au-field">
            <span>Change Password (optional)</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Leave empty to keep current password"
            />
          </label>

          <div className="au-field">
            <span>Role</span>
            <div className="au-role-options">
              {ROLE_OPTIONS.map((option) => (
                <label key={option.value} className="au-role-option">
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={form.role === option.value}
                    onChange={(e) => {
                      handleChange("role", e.target.value);
                      // Auto-set sections based on role
                      if (e.target.value === "superadmin") {
                        handleChange("allowedSections", ["web", "ai", "3d", "embedded"]);
                      } else if (e.target.value === "web_ai") {
                        handleChange("allowedSections", ["web", "ai"]);
                      }
                    }}
                  />
                  <div>
                    <div className="au-role-label">{option.label}</div>
                    <div className="au-role-description">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Show section checkboxes for custom role */}
          {form.role === "custom" && (
            <div className="au-field">
              <span>Allowed Sections</span>
              <div className="au-sections">
                {AVAILABLE_SECTIONS.map((section) => (
                  <label key={section} className="au-checkbox">
                    <input
                      type="checkbox"
                      checked={form.allowedSections.includes(section)}
                      onChange={() => toggleSection(section)}
                    />
                    <span>{section.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Show read-only sections for superadmin and web_ai */}
          {form.role !== "custom" && (
            <div className="au-field">
              <span>Allowed Sections</span>
              <div className="au-sections-readonly">
                {form.allowedSections.map((section) => (
                  <span key={section} className="au-section-tag">
                    {section.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <label className="au-field">
            <span>Status</span>
            <select
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) => handleChange("isActive", e.target.value === "active")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="au-modal__footer">
          <button className="au-btn au-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="au-btn au-btn--primary" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────
export const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (err) {
      setError(err.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (formData) => {
    await createAdmin(formData);
    await fetchAdmins();
  };

  const handleUpdate = async (id, updates) => {
    await updateAdmin(id, updates);
    await fetchAdmins();
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdmin(id);
      await fetchAdmins();
      setDeleteId(null);
    } catch (err) {
      setError(err.message || "Failed to delete admin");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAdminStatus(id);
      await fetchAdmins();
    } catch (err) {
      setError(err.message || "Failed to toggle status");
    }
  };

  if (loading) {
    return (
      <div className="au">
        <div className="au-loading">Loading admins...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="au">
        <div className="au-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="au">
      <div className="au-header">
        <div>
          <h1 className="au-title">Admin Users</h1>
          <p className="au-subtitle">{admins.length} total admins</p>
        </div>
        <button
          className="au-btn au-btn--primary"
          onClick={() => setModal("create")}
        >
          + New Admin
        </button>
      </div>

      <div className="au-grid">
        {admins.map((admin) => (
          <div key={admin.id} className="au-card">
            <div className="au-card__header">
              <div className="au-avatar">
                {admin.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="au-card__info">
                <div className="au-card__name">{admin.username}</div>
                <div className="au-card__role">
                  {admin.role === "superadmin" ? "👑 Superadmin" : 
                   admin.role === "web_ai" ? "Web + AI Admin" : 
                   "Custom Admin"}
                </div>
              </div>
              <span
                className={`au-status-badge au-status-badge--${
                  admin.isActive ? "active" : "inactive"
                }`}
              >
                {admin.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="au-card__body">
              <div className="au-card__sections">
                {(admin.allowedSections || []).map((section) => (
                  <span key={section} className="au-section-tag">
                    {section.toUpperCase()}
                  </span>
                ))}
              </div>
              {admin.lastLogin && (
                <div className="au-card__meta">
                  Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="au-card__actions">
              <button
                className="au-btn au-btn--ghost au-btn--sm"
                onClick={() => {
                  setSelectedAdmin(admin);
                  setModal("edit");
                }}
              >
                Edit
              </button>
              <button
                className={`au-btn au-btn--ghost au-btn--sm ${
                  admin.isActive ? "" : "au-btn--success"
                }`}
                onClick={() => handleToggle(admin.id)}
              >
                {admin.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                className="au-btn au-btn--ghost au-btn--sm au-btn--danger"
                onClick={() => setDeleteId(admin.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal === "create" && (
        <CreateModal onClose={() => setModal(null)} onSave={handleCreate} />
      )}

      {modal === "edit" && selectedAdmin && (
        <EditModal
          admin={selectedAdmin}
          onClose={() => {
            setModal(null);
            setSelectedAdmin(null);
          }}
          onSave={handleUpdate}
        />
      )}

      {deleteId && (
        <div className="au-overlay" onClick={() => setDeleteId(null)}>
          <div className="au-modal au-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="au-modal__header">
              <h2>Delete Admin?</h2>
            </div>
            <div className="au-modal__body">
              <p>This action cannot be undone.</p>
            </div>
            <div className="au-modal__footer">
              <button
                className="au-btn au-btn--ghost"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="au-btn au-btn--danger"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;