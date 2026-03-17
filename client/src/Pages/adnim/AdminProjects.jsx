import { useEffect, useState } from "react";
import { getAllProjects, createProject, updateProject, deleteProject } from "../../api/service/projectServ";
import { useAdmin } from "../../context/AdminContext";

const STATUS_LABELS  = { active: "Active", review: "In Review", done: "Done" };
const SECTION_LABELS = { web: "🌐 Web", ai: "🤖 AI", mobile: "📱 Mobile", embedded: "🔌 Embedded", "3d": "🎲 3D" };

const ALL_TABS = [
  { key: "all",      label: "All" },
  { key: "web",      label: "🌐 Web",      section: "web"      },
  { key: "ai",       label: "🤖 AI",       section: "ai"       },
  { key: "mobile",   label: "📱 Mobile",   section: "mobile"   },
  { key: "embedded", label: "🔌 Embedded", section: "embedded" },
  { key: "3d",       label: "🎲 3D",       section: "3d"       },
];

const SECTION_ADDONS = {
  web:      [{ key: "mobileAddon", label: "Mobile Add-on", price: 5000  }, { key: "aiAddon",     label: "AI Add-on",      price: 10000 }],
  ai:       [{ key: "webAddon",    label: "Web Add-on",    price: 15000 }, { key: "mobileAddon", label: "Mobile Add-on",  price: 5000  }],
  mobile:   [{ key: "webAddon",    label: "Web Add-on",    price: 15000 }, { key: "aiAddon",     label: "AI Add-on",      price: 10000 }],
  embedded: [{ key: "webAddon",    label: "Web Dashboard", price: 15000 }, { key: "mobileAddon", label: "Mobile Control", price: 5000  }],
  "3d":     [{ key: "webAddon",    label: "Web Embed",     price: 15000 }, { key: "mobileAddon", label: "Mobile Version", price: 5000  }],
};

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const emptyForm = {
  name: "", client: "", due: "", status: "active", progress: 0,
  price: "", mobileAddon: false, webAddon: false, aiAddon: false, section: "web",
};

const renderAddonCell = (p) => {
  const a = [];
  if (p.mobileAddon) a.push("📱");
  if (p.webAddon)    a.push("🌐");
  if (p.aiAddon)     a.push("🤖");
  return a.length ? a.join(" ") : "—";
};

const renderAddonReadonly = (form) => {
  const a = [];
  if (form.mobileAddon) a.push("📱 +Mobile");
  if (form.webAddon)    a.push("🌐 +Web");
  if (form.aiAddon)     a.push("🤖 +AI");
  if (!a.length) return null;
  return <span style={{ marginLeft:8, fontSize:13, opacity:0.7 }}>{a.join("  ")}</span>;
};

// ─── Add Modal ────────────────────────────────────────────
const AddModal = ({ form, onChange, onSave, onClose, allowedSections }) => {
  const addons = SECTION_ADDONS[form.section] ?? [];
  return (
    <div className="ab-overlay" onClick={onClose}>
      <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <h2 className="ab-modal__title">New Project</h2>
          <button className="ab-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="ab-modal__body">
          <label className="ab-field">
            <span>Section</span>
            <select value={form.section} onChange={(e) => {
              onChange("section", e.target.value);
              onChange("mobileAddon", false); onChange("webAddon", false); onChange("aiAddon", false);
            }}>
              {allowedSections.includes("web")      && <option value="web">🌐 Web</option>}
              {allowedSections.includes("ai")       && <option value="ai">🤖 AI</option>}
              {allowedSections.includes("mobile")   && <option value="mobile">📱 Mobile</option>}
              {allowedSections.includes("embedded") && <option value="embedded">🔌 Embedded</option>}
              {allowedSections.includes("3d")       && <option value="3d">🎲 3D</option>}
            </select>
          </label>
          <label className="ab-field"><span>Project Name</span><input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Project name" /></label>
          <label className="ab-field"><span>Client</span><input value={form.client} onChange={(e) => onChange("client", e.target.value)} placeholder="Client name" /></label>
          <label className="ab-field"><span>Due Date</span><input value={form.due} onChange={(e) => onChange("due", e.target.value)} placeholder="e.g. Apr 15, 2026" /></label>
          <label className="ab-field">
            <span>Price ($)</span>
            <input type="number" min="0" value={form.price} onChange={(e) => onChange("price", Number(e.target.value))} placeholder="e.g. 15000" />
          </label>
          {addons.map((addon) => (
            <label key={addon.key} className="ab-field">
              <span>{addon.label}</span>
              <select value={form[addon.key] ? "true" : "false"} onChange={(e) => onChange(addon.key, e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes (+${addon.price.toLocaleString()})</option>
              </select>
            </label>
          ))}
          <label className="ab-field">
            <span>Status</span>
            <select value={form.status} onChange={(e) => onChange("status", e.target.value)}>
              <option value="active">Active</option><option value="review">In Review</option><option value="done">Done</option>
            </select>
          </label>
          <label className="ab-field">
            <span>Progress ({form.progress}%)</span>
            <input type="range" min="0" max="100" value={form.progress} onChange={(e) => onChange("progress", Number(e.target.value))} />
          </label>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary" onClick={onSave}>Add Project</button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────
const EditModal = ({ form, onChange, onSave, onClose, isSuperAdmin }) => (
  <div className="ab-overlay" onClick={onClose}>
    <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
      <div className="ab-modal__header">
        <h2 className="ab-modal__title">Edit Project</h2>
        <button className="ab-modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="ab-modal__body">
        <div className="ab-field ab-field--readonly"><span>Section</span><p>{SECTION_LABELS[form.section] ?? form.section}</p></div>
        <div className="ab-field ab-field--readonly"><span>Project Name</span><p>{form.name}</p></div>
        <div className="ab-field ab-field--readonly"><span>Client</span><p>{form.client}</p></div>
        <div className="ab-field ab-field--readonly"><span>Due Date</span><p>{form.due}</p></div>
        <div className="ab-field ab-field--readonly">
          <span>Price</span>
          <p>{form.price != null ? `$${Number(form.price).toLocaleString("en-US")}` : "—"}{renderAddonReadonly(form)}</p>
        </div>

        {/* Vodafone Cash payment info — superadmin only */}
        {isSuperAdmin && (
          <>
            {form.senderName && (
              <div className="ab-field ab-field--readonly"><span>VF Sender Name</span><p>{form.senderName}</p></div>
            )}
            {form.whatsappNumber && (
              <div className="ab-field ab-field--readonly"><span>WhatsApp</span><p>{form.whatsappNumber}</p></div>
            )}
            {form.depositAmount > 0 && (
              <div className="ab-field ab-field--readonly">
                <span>Deposit</span>
                <p>
                  ${Number(form.depositAmount).toLocaleString("en-US")}
                  <span style={{ marginLeft:8, fontSize:12, opacity:0.6 }}>
                    {form.depositPaid ? "✅ Paid" : "⏳ Pending"}
                  </span>
                </p>
              </div>
            )}
            {form.paymentScreenshot && (
              <div className="ab-field ab-field--readonly">
                <span>Payment Screenshot</span>
                <img
                  src={form.paymentScreenshot}
                  alt="Payment screenshot"
                  style={{ maxWidth:"100%", maxHeight:180, borderRadius:8, marginTop:6, objectFit:"contain", border:"1px solid var(--bordercv-color)" }}
                />
              </div>
            )}
            <label className="ab-field">
              <span>Deposit Status</span>
              <select value={form.depositPaid ? "true" : "false"} onChange={(e) => onChange("depositPaid", e.target.value === "true")}>
                <option value="false">⏳ Pending</option>
                <option value="true">✅ Paid</option>
              </select>
            </label>
          </>
        )}

        <label className="ab-field">
          <span>Status</span>
          <select value={form.status} onChange={(e) => onChange("status", e.target.value)}>
            <option value="active">Active</option><option value="review">In Review</option><option value="done">Done</option>
          </select>
        </label>
        <label className="ab-field">
          <span>Progress ({form.progress}%)</span>
          <input type="range" min="0" max="100" value={form.progress} onChange={(e) => onChange("progress", Number(e.target.value))} />
        </label>
      </div>
      <div className="ab-modal__footer">
        <button className="ab-btn ab-btn--ghost" onClick={onClose}>Cancel</button>
        <button className="ab-btn ab-btn--primary" onClick={onSave}>Save Changes</button>
      </div>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────
export const AdminProjects = () => {
  const { admin, isSuperAdmin } = useAdmin();
  const allowedSections = admin?.allowedSections ?? [];

  const [projects,  setProjects]  = useState([]);
  const [modal,     setModal]     = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [editId,    setEditId]    = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const visibleTabs = ALL_TABS.filter((tab) => tab.key === "all" || allowedSections.includes(tab.section));

  useEffect(() => {
    getAllProjects().then((res) => setProjects(res.data)).catch(setError).finally(() => setLoading(false));
  }, []);

  const visibleProjects = projects
    .filter((p) => allowedSections.includes(p.section))
    .filter((p) => activeTab === "all" || p.section === activeTab);

  const handleField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => {
    const defaultSection = allowedSections[0] ?? "web";
    setForm({ ...emptyForm, section: defaultSection });
    setModal("add");
  };

  const openEdit = (p) => {
    setForm({
      name:              p.name,
      client:            p.client,
      due:               p.due,
      price:             p.price ?? "",
      mobileAddon:       p.mobileAddon       ?? false,
      webAddon:          p.webAddon          ?? false,
      aiAddon:           p.aiAddon           ?? false,
      section:           p.section           ?? "web",
      status:            p.status,
      progress:          p.progress,
      senderName:        p.senderName        ?? "",
      whatsappNumber:    p.whatsappNumber     ?? "",
      paymentScreenshot: p.paymentScreenshot ?? "",
      depositPaid:       p.depositPaid       ?? false,
      depositAmount:     p.depositAmount     ?? 0,
    });
    setEditId(p._id);
    setModal("edit");
  };

  const close = () => { setModal(null); setEditId(null); };

  const handleSave = async () => {
    if (modal === "add" && !form.name.trim()) return;
    try {
      if (modal === "add") {
        const res = await createProject(form);
        setProjects((prev) => [...prev, res.data]);
      } else {
        const res = await updateProject(editId, {
          status:      form.status,
          progress:    form.progress,
          depositPaid: form.depositPaid,
        });
        setProjects((prev) => prev.map((p) => p._id === editId ? res.data : p));
      }
      close();
    } catch (err) { setError(err); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setDeleteId(null);
    } catch (err) { setError(err); }
  };

  if (loading) return <div className="ab"><p style={{ padding:"2rem" }}>Loading projects...</p></div>;
  if (error)   return <div className="ab"><p style={{ padding:"2rem", color:"red" }}>Error: {String(error)}</p></div>;

  return (
    <div className="ab">
      <div className="ab__topbar">
        <div>
          <h1 className="ab__title">Projects</h1>
          <p className="ab__subtitle">{visibleProjects.length} total · {visibleProjects.filter((p) => p.status === "active").length} active</p>
        </div>
        <button className="ab-btn ab-btn--primary" onClick={openAdd}><PlusIcon /> New Project</button>
      </div>

      <div className="ap-tabs">
        {visibleTabs.map((tab) => (
          <button key={tab.key} className={`ap-tab ${activeTab === tab.key ? "ap-tab--active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
            <span className="ap-tab__count">
              {tab.key === "all" ? projects.filter((p) => allowedSections.includes(p.section)).length : projects.filter((p) => p.section === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="ap-table">
        <div className="ap-table__head">
          <span>Name</span><span>Client</span><span>Due</span><span>Section</span>
          <span>Price</span><span>Add-ons</span>
          {isSuperAdmin && <span>Deposit</span>}
          <span>Status</span><span>Progress</span><span></span>
        </div>

        {visibleProjects.map((p) => (
          <div className="ap-table__row" key={p._id}>
            <span className="ap-table__name">{p.name}</span>
            <span className="ap-table__client">{p.client}</span>
            <span className="ap-table__due">{p.due}</span>
            <span className={`ap-section-badge ap-section-badge--${p.section}`}>{SECTION_LABELS[p.section] ?? p.section}</span>
            <span className="ap-table__price">{p.price != null ? `$${Number(p.price).toLocaleString("en-US")}` : "—"}</span>
            <span className="ap-table__mobile">{renderAddonCell(p)}</span>
            {/* Deposit status — superadmin only */}
            {isSuperAdmin && (
              <span className="ap-table__deposit">
                {p.depositAmount > 0
                  ? <span title={p.whatsappNumber ? `WhatsApp: ${p.whatsappNumber}` : ""}>{p.depositPaid ? "✅" : "⏳"} ${Number(p.depositAmount).toLocaleString("en-US")}</span>
                  : "—"}
              </span>
            )}
            <span className={`ap-badge ap-badge--${p.status}`}>{STATUS_LABELS[p.status]}</span>
            <div className="ap-progress">
              <div className="ap-progress__bar"><div className="ap-progress__fill" style={{ width:`${p.progress}%` }} /></div>
              <span className="ap-progress__label">{p.progress}%</span>
            </div>
            <div className="ap-table__actions">
              <button className="ab-icon-btn" onClick={() => openEdit(p)} title="Edit">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button className="ab-icon-btn ab-icon-btn--danger" onClick={() => setDeleteId(p._id)} title="Delete">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>
        ))}

        {visibleProjects.length === 0 && (
          <div className="ab__empty">
            <p>No {activeTab === "all" ? "" : SECTION_LABELS[activeTab]} projects yet.</p>
            <button className="ab-btn ab-btn--primary" onClick={openAdd}><PlusIcon /> Add your first project</button>
          </div>
        )}
      </div>

      {modal === "add"  && <AddModal form={form} onChange={handleField} onSave={handleSave} onClose={close} allowedSections={allowedSections} />}
      {modal === "edit" && <EditModal form={form} onChange={handleField} onSave={handleSave} onClose={close} isSuperAdmin={isSuperAdmin} />}

      {deleteId && (
        <div className="ab-overlay" onClick={() => setDeleteId(null)}>
          <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="ab-modal__header"><h2 className="ab-modal__title">Delete Project?</h2></div>
            <div className="ab-modal__body"><p style={{ color:"var(--text-color)", opacity:0.7 }}>This cannot be undone.</p></div>
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