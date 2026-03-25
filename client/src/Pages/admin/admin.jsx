import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import "./admin.css";
import { AdminBlog } from "./AdminBlog";
import { AdminProjects } from "./AdminProjects";
import { AdminUsers } from "./Adminusers";
import { AdminProvider, useAdmin } from "../../context/AdminContext";
import { loginAdmin } from "../../api/service/adminAuthServ";
import { GetContact, getStats } from "../../api/service/adminServ";

const GridIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const DashboardIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const ProjectsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const BlogIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const RevenueIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const ProjectsMetricIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const LeadsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const Spinner = () => (
  <span
    style={{
      display: "inline-block",
      width: 14,
      height: 14,
      border: "2px solid currentColor",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }}
  />
);

const loginStyles = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .login-shell { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--background-color); position:relative; overflow:hidden; }
  .login-grid-bg { position:absolute; inset:0; background-image:linear-gradient(var(--bordercv-color) 1px,transparent 1px),linear-gradient(90deg,var(--bordercv-color) 1px,transparent 1px); background-size:40px 40px; opacity:0.35; pointer-events:none; }
  .login-card { position:relative; z-index:1; background:var(--background-color); border:1.5px solid var(--bordercv-color); border-radius:16px; padding:2.5rem 2rem; width:100%; max-width:400px; box-shadow:0 8px 40px rgba(0,0,0,0.12); }
  .login-brand { display:flex; align-items:center; gap:10px; margin-bottom:1.5rem; color:var(--logo-text-color); }
  .login-brand-name { font-size:1rem; font-weight:700; letter-spacing:.06em; font-family:'Space Mono',monospace; color:var(--logo-text-color); text-transform:uppercase; }
  .login-title { font-size:1.75rem; font-weight:700; color:var(--text-color); margin-bottom:4px; font-family:'Rajdhani',sans-serif; letter-spacing:.02em; }
  .login-subtitle { font-size:.9rem; color:var(--text-color); opacity:.5; margin-bottom:2rem; font-family:'Space Mono',monospace; }
  .login-field { display:flex; flex-direction:column; gap:6px; margin-bottom:1rem; }
  .login-label { font-size:.8rem; font-weight:600; color:var(--text-color); opacity:.6; letter-spacing:.06em; text-transform:uppercase; font-family:'Rajdhani',sans-serif; }
  .login-input { background:rgba(246,247,251,.05); border:1.5px solid var(--bordercv-color); border-radius:8px; padding:9px 12px; color:var(--text-color); font-family:'Rajdhani',sans-serif; font-size:1rem; font-weight:500; outline:none; width:100%; box-sizing:border-box; transition:border-color .15s; }
  .login-input::placeholder { opacity:.4; }
  .login-input:focus { border-color:var(--logo-text-color); }
  .login-input.error { border-color:#e53e3e; }
  .login-input:disabled { opacity:.5; }
  .login-hint { font-size:.75rem; font-family:'Space Mono',monospace; color:#e53e3e; min-height:16px; }
  .login-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:10px 18px; margin-top:1.5rem; border-radius:8px; font-family:'Rajdhani',sans-serif; font-size:1rem; font-weight:700; letter-spacing:.04em; cursor:pointer; border:none; background:var(--logo-text-color); color:var(--background-color); transition:opacity .18s,transform .1s; }
  .login-btn:hover:not(:disabled) { opacity:.85; }
  .login-btn:active:not(:disabled) { transform:scale(.98); }
  .login-btn:disabled { opacity:.4; cursor:not-allowed; }
  .login-feedback { margin-top:12px; padding:10px 14px; border-radius:8px; font-size:.95rem; font-weight:600; letter-spacing:.02em; }
  .login-feedback--error { background:rgba(229,62,62,.1); border:1.5px solid rgba(229,62,62,.35); color:#fc8181; }
  .login-feedback--success { background:rgba(104,211,145,.1); border:1.5px solid rgba(104,211,145,.35); color:#68d391; }
  .login-divider { border:none; border-top:1.5px solid var(--bordercv-color); margin:1.5rem 0 1rem; }
  .login-meta { font-size:.78rem; font-family:'Space Mono',monospace; color:var(--text-color); opacity:.4; text-align:center; }
  .login-meta code { background:color-mix(in srgb,var(--logo-text-color) 15%,transparent); border:1px solid var(--logo-text-color); color:var(--logo-text-color); padding:1px 6px; border-radius:4px; font-size:.72rem; font-family:'Space Mono',monospace; font-weight:700; }
  @media (max-width:480px) { .login-card { padding:1.75rem 1.25rem; } .login-title { font-size:1.5rem; } }
`;

const MAX_ATTEMPTS = 3;

// Navigation items - superadmin sees all, others see based on permissions
const BASE_NAV = [
  { id: "dashboard", label: "Dashboard", Icon: DashboardIcon, superadminOnly: true },
  { id: "projects", label: "Projects", Icon: ProjectsIcon, superadminOnly: false },
  { id: "blog", label: "Blog", Icon: BlogIcon, superadminOnly: false },
  { id: "users", label: "Admin Users", Icon: UsersIcon, superadminOnly: true },
];

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

// ── Login Page ─────────────────────────────────────────────
const LoginPage = ({ onSuccess }) => {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  const locked = attempts >= MAX_ATTEMPTS;

  const validate = useCallback(() => {
    const errs = {};
    if (!username.trim()) errs.username = "Required";
    if (!password) errs.password = "Required";
    return errs;
  }, [username, password]);

  const handleLogin = useCallback(async () => {
    if (locked) return;
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    setMessage("");

    try {
      
      // Call login API
      const res = await loginAdmin({ username: username.trim(), password });
      
      
      // Extract token and admin from response
      // Backend returns: { success: true, data: { token, admin } }
      const { token, admin } = res.data;
      
      
      // Verify we got both token and admin
      if (!token || !admin) {
        throw new Error("Invalid login response - missing token or admin data");
      }
      
      // Save to context (which also saves to localStorage)
      login(admin, token);
      
      // Verify it was saved
      const savedToken = localStorage.getItem("adminToken");
      
      setStatus("success");
      setMessage("Access granted. Redirecting…");
      setTimeout(() => onSuccess(), 800);
    } catch (err) {
      console.error("❌ Login error:", err);
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setStatus("locked");
        setMessage("Too many failed attempts. Account locked.");
      } else {
        setStatus("error");
        const remaining = MAX_ATTEMPTS - newAttempts;
        setMessage(
          `${err} — ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
        );
      }
    }
  }, [username, password, attempts, locked, validate, login, onSuccess]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };
  const isLoading = status === "loading";
  const isDisabled = isLoading || locked || status === "success";

  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-shell">
        <div className="login-grid-bg" />
        <div className="login-card">
          <div className="login-brand">
            <GridIcon />
            <span className="login-brand-name">Softuuare Admin</span>
          </div>
          <div className="login-title">Welcome back</div>
          <div className="login-subtitle">sign in to your account</div>

          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((p) => ({ ...p, username: "" }));
              }}
              onKeyDown={handleKeyDown}
              placeholder="username"
              autoComplete="off"
              disabled={isDisabled}
              className={`login-input${errors.username ? " error" : ""}`}
            />
            <div className="login-hint">{errors.username || ""}</div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: "" }));
              }}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              autoComplete="off"
              disabled={isDisabled}
              className={`login-input${errors.password ? " error" : ""}`}
            />
            <div className="login-hint">{errors.password || ""}</div>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={isDisabled}>
            {isLoading ? (
              <>
                <Spinner /> Signing in…
              </>
            ) : locked ? (
              "🔒 Account Locked"
            ) : (
              "Sign in →"
            )}
          </button>

          {(status === "error" || status === "locked") && (
            <div className="login-feedback login-feedback--error">{message}</div>
          )}
          {status === "success" && (
            <div className="login-feedback login-feedback--success">{message}</div>
          )}
        </div>
      </div>
    </>
  );
};

// ── Dashboard (superadmin only) ────────────────────────────
const Dashboard = () => {
  const [tableRows, setTableRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(setError)
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    GetContact()
      .then(setTableRows)
      .catch(setError)
      .finally(() => setContactLoading(false));
  }, []);

  const metrics =
    statsLoading || !stats
      ? [
          { label: "Total Revenue", value: "—", badge: "loading", Icon: RevenueIcon },
          {
            label: "Active Projects",
            value: "—",
            badge: "loading",
            Icon: ProjectsMetricIcon,
          },
          { label: "Pending Leads", value: "—", badge: "loading", Icon: LeadsIcon },
        ]
      : [
          {
            label: "Total Revenue",
            value: fmtCurrency(stats.totalRevenue),
            badge: `${stats.total} total`,
            Icon: RevenueIcon,
          },
          {
            label: "Active Projects",
            value: stats.active ?? "—",
            badge: "active",
            Icon: ProjectsMetricIcon,
          },
          {
            label: "Pending Leads",
            value: tableRows.length,
            badge: "contacts",
            Icon: LeadsIcon,
          },
        ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your portfolio metrics</p>
      </div>
      {error && (
        <div style={{ color: "#fc8181", marginBottom: "1rem" }}>
          ⚠ {String(error)}
        </div>
      )}
      <div className="metrics-grid">
        {metrics.map(({ label, value, badge, Icon }) => (
          <div key={label} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{label}</span>
              <Icon />
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-badge">{badge}</div>
          </div>
        ))}
      </div>
      <div className="table-header">
        <span className="table-title">Recent Contacts</span>
      </div>
      <div className="contact-table">
        <div className="table-row table-row--head">
          <span className="table-cell">Name</span>
          <span className="table-cell">Phone</span>
          <span className="table-cell">Email</span>
          <span className="table-cell">Subject</span>
        </div>
        {contactLoading && (
          <div className="table-row" style={{ opacity: 0.5 }}>
            Loading…
          </div>
        )}
        {!contactLoading && tableRows.length === 0 && (
          <div className="table-row" style={{ opacity: 0.5 }}>
            No contacts yet.
          </div>
        )}
        {tableRows.map((row, i) => {
          const phoneMatch = row.name.match(/\(([^)]+)\)/);
          const phone = phoneMatch ? phoneMatch[1] : "—";
          const cleanName = row.name.replace(/\s*\([^)]*\)/, "").trim();
                
          return (
            <div key={i} className="table-row">
              <span className="table-cell">{cleanName}</span>
              <span className="table-cell">{phone}</span>
              <span className="table-cell">{row.email}</span>
              <span className="table-cell">{row.subject}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ── Forbidden ──────────────────────────────────────────────
const Forbidden = () => (
  <div style={{ padding: "4rem 2rem", textAlign: "center", opacity: 0.55 }}>
    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
    <h2
      style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: "1.5rem",
        marginBottom: ".5rem",
      }}
    >
      Access Restricted
    </h2>
    <p style={{ fontFamily: "Space Mono, monospace", fontSize: ".8rem" }}>
      This page is only accessible to super admins.
    </p>
  </div>
);

// ── Admin Shell ────────────────────────────────────────────
const AdminShell = ({ theme }) => {
  const { admin, logout, isSuperAdmin } = useAdmin();
  const [page, setPage] = useState(isSuperAdmin ? "dashboard" : "projects");

  const visibleNav = BASE_NAV.filter(
    (item) => !item.superadminOnly || isSuperAdmin
  );

  const renderPage = () => {
    switch (page) {
      case "blog":
        return <AdminBlog />;
      case "projects":
        return <AdminProjects />;
      case "users":
        return isSuperAdmin ? <AdminUsers /> : <Forbidden />;
      case "dashboard":
        return isSuperAdmin ? <Dashboard /> : <Forbidden />;
      default:
        return isSuperAdmin ? <Dashboard /> : <AdminProjects />;
    }
  };

  // Role label — maps role to human-readable string
  const getRoleLabel = () => {
    if (admin?.role === "superadmin") return "Super Admin";
    if (admin?.role === "web_ai") return "Web · AI · Mobile";
    if (admin?.allowedSections && admin.allowedSections.length > 0) {
      return admin.allowedSections.map((s) => s.toUpperCase()).join(" · ");
    }
    return admin?.role || "Admin";
  };

  return (
    <div data-theme={theme}>
      <div className="admin-shell">
        <aside className="sidebar">
          <Link to="/">
            <div className="sidebar-brand">
              <span className="brand-name">Softuuare Admin</span>
            </div>
          </Link>
          <nav>
            {visibleNav.map(({ id, label, Icon }) => (
              <div
                key={id}
                className={`nav-item ${page === id ? "active" : ""}`}
                onClick={() => setPage(id)}
              >
                <Icon />
                {label}
              </div>
            ))}
          </nav>
          <div className="sidebar-divider" />
          <div className="sidebar-user">
            <div className="user-name">{admin?.username ?? "Admin"}</div>
            <div className="user-role">{getRoleLabel()}</div>
            <div
              style={{
                marginTop: "10px",
                fontSize: ".75rem",
                cursor: "pointer",
                opacity: 0.5,
                fontFamily: "Space Mono,monospace",
              }}
              onClick={logout}
            >
              sign out →
            </div>
          </div>
        </aside>
        <main className="main-content">{renderPage()}</main>
      </div>
    </div>
  );
};

// ── AdminRoot ──────────────────────────────────────────────
const AdminRoot = ({ theme }) => {
  const { admin } = useAdmin();
  const [authenticated, setAuthenticated] = useState(!!admin);

  useEffect(() => {
    setAuthenticated(!!admin);
  }, [admin]);

  if (!authenticated) {
    return (
      <div data-theme={theme}>
        <LoginPage onSuccess={() => setAuthenticated(true)} />
      </div>
    );
  }

  return <AdminShell theme={theme} />;
};

export const Admin = ({ theme }) => (
  <AdminProvider>
    <AdminRoot theme={theme} />
  </AdminProvider>
);

export default Admin;