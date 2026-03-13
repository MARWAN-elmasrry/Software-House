import { useEffect, useState } from "react";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/service/projectServ";

const STATUS_LABELS = { active: "Active", review: "In Review", done: "Done" };

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const emptyForm = { name: "", client: "", due: "", status: "active", progress: 0 };

const Modal = ({ form, onChange, onSave, onClose, isEdit }) => (
  <div className="ab-overlay" onClick={onClose}>
    <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
      <div className="ab-modal__header">
        <h2 className="ab-modal__title">{isEdit ? "Edit Project" : "New Project"}</h2>
        <button className="ab-modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="ab-modal__body">
        <label className="ab-field">
          <span>Project Name</span>
          <input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Project name" />
        </label>
        <label className="ab-field">
          <span>Client</span>
          <input value={form.client} onChange={(e) => onChange("client", e.target.value)} placeholder="Client name" />
        </label>
        <label className="ab-field">
          <span>Due Date</span>
          <input value={form.due} onChange={(e) => onChange("due", e.target.value)} placeholder="e.g. Apr 15, 2026" />
        </label>
        <label className="ab-field">
          <span>Status</span>
          <select value={form.status} onChange={(e) => onChange("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="review">In Review</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="ab-field">
          <span>Progress ({form.progress}%)</span>
          <input type="range" min="0" max="100" value={form.progress} onChange={(e) => onChange("progress", Number(e.target.value))} />
        </label>
      </div>
      <div className="ab-modal__footer">
        <button className="ab-btn ab-btn--ghost" onClick={onClose}>Cancel</button>
        <button className="ab-btn ab-btn--primary" onClick={onSave}>{isEdit ? "Save Changes" : "Add Project"}</button>
      </div>
    </div>
  </div>
);

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [editId, setEditId]     = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ─── Fetch all projects on mount ──────────────────────────────────────────
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await getAllProjects();
        setProjects(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd  = () => { setForm(emptyForm); setModal("add"); };
  const openEdit = (p) => { setForm({ name: p.name, client: p.client, due: p.due, status: p.status, progress: p.progress }); setEditId(p._id); setModal("edit"); };
  const close    = () => { setModal(null); setEditId(null); };

  // ─── Create / Update ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (modal === "add") {
        const res = await createProject(form);
        setProjects((prev) => [...prev, res.data]);
      } else {
        const res = await updateProject(editId, form);
        setProjects((prev) => prev.map((p) => p._id === editId ? res.data : p));
      }
      close();
    } catch (err) {
      setError(err);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err);
    }
  };

  // ─── UI States ────────────────────────────────────────────────────────────
  if (loading) return <div className="ab"><p style={{ padding: "2rem" }}>Loading projects...</p></div>;
  if (error)   return <div className="ab"><p style={{ padding: "2rem", color: "red" }}>Error: {error}</p></div>;

  return (
    <div className="ab">
      {/* Topbar */}
      <div className="ab__topbar">
        <div>
          <h1 className="ab__title">Projects</h1>
          <p className="ab__subtitle">
            {projects.length} total · {projects.filter((p) => p.status === "active").length} active
          </p>
        </div>
        <button className="ab-btn ab-btn--primary" onClick={openAdd}>
          <PlusIcon /> New Project
        </button>
      </div>

      {/* Table */}
      <div className="ap-table">
        <div className="ap-table__head">
          <span>Name</span>
          <span>Client</span>
          <span>Due</span>
          <span>Status</span>
          <span>Progress</span>
          <span></span>
        </div>

        {projects.map((p) => (
          <div className="ap-table__row" key={p._id}>
            <span className="ap-table__name">{p.name}</span>
            <span className="ap-table__client">{p.client}</span>
            <span className="ap-table__due">{p.due}</span>
            <span className={`ap-badge ap-badge--${p.status}`}>{STATUS_LABELS[p.status]}</span>
            <div className="ap-progress">
              <div className="ap-progress__bar">
                <div className="ap-progress__fill" style={{ width: `${p.progress}%` }} />
              </div>
              <span className="ap-progress__label">{p.progress}%</span>
            </div>
            <div className="ap-table__actions">
              <button className="ab-icon-btn" onClick={() => openEdit(p)} title="Edit">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button className="ab-icon-btn ab-icon-btn--danger" onClick={() => setDeleteId(p._id)} title="Delete">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="ab__empty">
            <p>No projects yet.</p>
            <button className="ab-btn ab-btn--primary" onClick={openAdd}>
              <PlusIcon /> Add your first project
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          form={form}
          onChange={handleField}
          onSave={handleSave}
          onClose={close}
          isEdit={modal === "edit"}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="ab-overlay" onClick={() => setDeleteId(null)}>
          <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="ab-modal__header">
              <h2 className="ab-modal__title">Delete Project?</h2>
            </div>
            <div className="ab-modal__body">
              <p style={{ color: "var(--text-color)", opacity: 0.7 }}>This cannot be undone.</p>
            </div>
            <div className="ab-modal__footer">
              <button className="ab-btn ab-btn--ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="ab-btn ab-btn--danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;