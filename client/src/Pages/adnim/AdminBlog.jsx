import { useState } from "react";

const initialProjects = [
  {
    id: 1,
    title: "This Main Proj",
    description: "This Main Proj",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=250&fit=crop",
    important: true,
    link: "#",
  },
  {
    id: 2,
    title: "This Side Proj",
    description: "This Main Proj",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=250&fit=crop",
    important: false,
    link: "#",
  },
  {
    id: 3,
    title: "Another Main Proj",
    description: "This Main Proj",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=250&fit=crop",
    important: true,
    link: "#",
  },
];

const emptyForm = { title: "", description: "", image: "", important: false, link: "" };

// ── Sub-components ─────────────────────────────────────────

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ── Modal ──────────────────────────────────────────────────
const Modal = ({ form, onChange, onSave, onClose, isEdit }) => (
  <div className="ab-overlay" onClick={onClose}>
    <div className="ab-modal" onClick={e => e.stopPropagation()}>
      <div className="ab-modal__header">
        <h2 className="ab-modal__title">{isEdit ? "Edit Project" : "New Project"}</h2>
        <button className="ab-modal__close" onClick={onClose}>✕</button>
      </div>

      <div className="ab-modal__body">
        <label className="ab-field">
          <span>Title</span>
          <input value={form.title} onChange={e => onChange("title", e.target.value)} placeholder="Project title" />
        </label>
        <label className="ab-field">
          <span>Description</span>
          <textarea value={form.description} onChange={e => onChange("description", e.target.value)} placeholder="Short description" rows={3} />
        </label>
        <label className="ab-field">
          <span>Image URL</span>
          <input value={form.image} onChange={e => onChange("image", e.target.value)} placeholder="https://..." />
        </label>
        <label className="ab-field">
          <span>Link</span>
          <input value={form.link} onChange={e => onChange("link", e.target.value)} placeholder="https://..." />
        </label>
        <label className="ab-field ab-field--row">
          <input type="checkbox" checked={form.important} onChange={e => onChange("important", e.target.checked)} />
          <span>Mark as important / featured</span>
        </label>
      </div>

      <div className="ab-modal__footer">
        <button className="ab-btn ab-btn--ghost" onClick={onClose}>Cancel</button>
        <button className="ab-btn ab-btn--primary" onClick={onSave}>{isEdit ? "Save Changes" : "Add Project"}</button>
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────
export const AdminBlog = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const openAdd = () => { setForm(emptyForm); setModal("add"); };
  const openEdit = (p) => { setForm({ title: p.title, description: p.description, image: p.image, important: p.important, link: p.link }); setEditId(p.id); setModal("edit"); };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (modal === "add") {
      setProjects(prev => [...prev, { ...form, id: Date.now() }]);
    } else {
      setProjects(prev => prev.map(p => p.id === editId ? { ...p, ...form } : p));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
  };

  const toggleImportant = (id) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, important: !p.important } : p));

  return (
    <div className="ab">
      {/* Header */}
      <div className="ab__topbar">
        <div>
          <h1 className="ab__title">Blog Projects</h1>
          <p className="ab__subtitle">{projects.length} project{projects.length !== 1 ? "s" : ""} · {projects.filter(p => p.important).length} featured</p>
        </div>
        <button className="ab-btn ab-btn--primary" onClick={openAdd}>
          <PlusIcon /> Add Project
        </button>
      </div>

      {/* Cards Grid */}
      <div className="ab__grid">
        {projects.map(p => (
          <div key={p.id} className={`ab-card ${p.important ? "ab-card--featured" : ""}`}>
            <div className="ab-card__img">
              <img src={p.image} alt={p.title} />
              {p.important && <span className="ab-card__badge">Featured</span>}
            </div>
            <div className="ab-card__body">
              <h3 className="ab-card__title">{p.title}</h3>
              <p className="ab-card__desc">{p.description}</p>
              <a className="ab-card__link" href={p.link} target="_blank" rel="noreferrer">{p.link}</a>
            </div>
            <div className="ab-card__actions">
              <button
                className={`ab-icon-btn ${p.important ? "ab-icon-btn--star" : ""}`}
                title={p.important ? "Unfeature" : "Feature"}
                onClick={() => toggleImportant(p.id)}
              >
                <StarIcon filled={p.important} />
              </button>
              <button className="ab-icon-btn" title="Edit" onClick={() => openEdit(p)}>
                <EditIcon />
              </button>
              <button className="ab-icon-btn ab-icon-btn--danger" title="Delete" onClick={() => setDeleteId(p.id)}>
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="ab__empty">
            <p>No projects yet.</p>
            <button className="ab-btn ab-btn--primary" onClick={openAdd}><PlusIcon /> Add your first project</button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          form={form}
          onChange={handleField}
          onSave={handleSave}
          onClose={closeModal}
          isEdit={modal === "edit"}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="ab-overlay" onClick={() => setDeleteId(null)}>
          <div className="ab-modal ab-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="ab-modal__header">
              <h2 className="ab-modal__title">Delete Project?</h2>
            </div>
            <div className="ab-modal__body">
              <p style={{ color: "var(--text-color)", opacity: 0.7 }}>This action cannot be undone.</p>
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

export default AdminBlog;