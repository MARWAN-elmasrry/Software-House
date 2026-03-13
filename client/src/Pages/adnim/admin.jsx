import { useState, useCallback, useEffect } from "react";
import { AdminBlog } from "./AdminBlog";
import { AdminProjects } from "./AdminProjects";
import { Link } from "react-router-dom";
import { GetContact } from "../../api/service/adminServ";
import "./admin.css";

// ── Icons ──────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const ProjectsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>
);
const BlogIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h6M7 16h8" />
  </svg>
);
const RevenueIcon = () => (
  <svg className="metric-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 44 L20 32 L30 36 L40 22" /><path d="M36 22 h8 v8" />
    <line x1="10" y1="52" x2="54" y2="52" />
    <line x1="16" y1="52" x2="16" y2="44" strokeWidth="5" />
    <line x1="28" y1="52" x2="28" y2="36" strokeWidth="5" />
    <line x1="40" y1="52" x2="40" y2="30" strokeWidth="5" />
    <circle cx="48" cy="14" r="8" strokeWidth="2" /><path d="M46 14 h4 M48 12 v4" />
  </svg>
);
const ProjectsMetricIcon = () => (
  <svg className="metric-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="14" width="38" height="32" rx="3" /><rect x="14" y="8" width="38" height="32" rx="3" />
    <path d="M20 28 h20 M20 35 h14" /><path d="M26 22 l4 4 8-8" strokeWidth="2.5" />
  </svg>
);
const LeadsIcon = () => (
  <svg className="metric-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="10" width="44" height="44" rx="4" /><circle cx="32" cy="32" r="10" />
    <line x1="32" y1="10" x2="32" y2="22" /><line x1="32" y1="42" x2="32" y2="54" />
    <line x1="10" y1="32" x2="22" y2="32" /><line x1="42" y1="32" x2="54" y2="32" />
    <circle cx="32" cy="32" r="3" fill="currentColor" />
  </svg>
);
const GridIcon = () => (
  <svg style={{ width: 22, height: 22, color: "var(--logo-text-color)", flexShrink: 0 }}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" style={{ color: "var(--background-color)" }}>
    <circle cx="8" cy="8" r="6" strokeOpacity="0.25" />
    <path d="M8 2 A6 6 0 0 1 14 8">
      <animateTransform attributeName="transform" type="rotate"
        from="0 8 8" to="360 8 8" dur="0.75s" repeatCount="indefinite" />
    </path>
  </svg>
);

// ── Data ───────────────────────────────────────────────────
const metrics = [
  { label: "Total Revenue",   value: "$124,500", badge: "+12%",         Icon: RevenueIcon },
  { label: "Active Projects", value: "12",       badge: "+2 this week", Icon: ProjectsMetricIcon },
  { label: "Pending Leads",   value: "5",        badge: "+5 new",       Icon: LeadsIcon },
];

const NAV = [
  { id: "dashboard", label: "dashboard", Icon: DashboardIcon },
  { id: "projects",  label: "Projects",  Icon: ProjectsIcon  },
  { id: "blog",      label: "Blog",      Icon: BlogIcon      },
];

// ── Login styles ───────────────────────────────────────────
const loginStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .login-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background-color);
    font-family: 'Rajdhani', sans-serif;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  .login-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--bordercv-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--bordercv-color) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.35;
    pointer-events: none;
  }
  .login-card {
    background: var(--background-color);
    border: 1.5px solid var(--bordercv-color);
    border-radius: 14px;
    padding: 2.5rem;
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
    animation: fadeSlideIn 0.4s ease both;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .login-card:hover {
    border-color: var(--logo-text-color);
    box-shadow: 0 0 18px color-mix(in srgb, var(--logo-text-color) 20%, transparent);
  }
  .login-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 2rem;
  }
  .login-brand-name {
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--logo-text-color);
  }
  .login-title {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--text-color);
    margin-bottom: 4px;
  }
  .login-subtitle {
    font-size: 1rem;
    color: var(--text-color);
    opacity: 0.5;
    margin-bottom: 2rem;
    font-family: 'Space Mono', monospace;
  }
  .login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 1rem;
  }
  .login-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-color);
    opacity: 0.6;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .login-input {
    background: rgba(246, 247, 251, 0.05);
    border: 1.5px solid var(--bordercv-color);
    border-radius: 8px;
    padding: 9px 12px;
    color: var(--text-color);
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .login-input::placeholder { opacity: 0.4; }
  .login-input:focus { border-color: var(--logo-text-color); }
  .login-input.error { border-color: #e53e3e; }
  .login-input:disabled { opacity: 0.5; }
  .login-hint {
    font-size: 0.75rem;
    font-family: 'Space Mono', monospace;
    color: #e53e3e;
    min-height: 16px;
  }
  .login-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 10px 18px;
    margin-top: 1.5rem;
    border-radius: 8px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    border: none;
    background: var(--logo-text-color);
    color: var(--background-color);
    transition: opacity 0.18s, transform 0.1s;
  }
  .login-btn:hover:not(:disabled) { opacity: 0.85; }
  .login-btn:active:not(:disabled) { transform: scale(0.98); }
  .login-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .login-feedback {
    margin-top: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .login-feedback--error {
    background: rgba(229, 62, 62, 0.1);
    border: 1.5px solid rgba(229, 62, 62, 0.35);
    color: #fc8181;
  }
  .login-feedback--success {
    background: rgba(104, 211, 145, 0.1);
    border: 1.5px solid rgba(104, 211, 145, 0.35);
    color: #68d391;
  }
  .login-divider {
    border: none;
    border-top: 1.5px solid var(--bordercv-color);
    margin: 1.5rem 0 1rem;
  }
  .login-meta {
    font-size: 0.78rem;
    font-family: 'Space Mono', monospace;
    color: var(--text-color);
    opacity: 0.4;
    text-align: center;
  }
  .login-meta code {
    background: color-mix(in srgb, var(--logo-text-color) 15%, transparent);
    border: 1px solid var(--logo-text-color);
    color: var(--logo-text-color);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 0.72rem;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
  }
  @media (max-width: 480px) {
    .login-card { padding: 1.75rem 1.25rem; }
    .login-title { font-size: 1.5rem; }
  }
`;

// ── Constants ──────────────────────────────────────────────
const MAX_ATTEMPTS = 3;
const VALID_CREDS = { username: "admin", password: "admin" };

// ── Login Page ─────────────────────────────────────────────
const LoginPage = ({ onSuccess }) => {
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

  const handleLogin = useCallback(() => {
    if (locked) return;
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    setMessage("");

    setTimeout(() => {
      if (username === VALID_CREDS.username && password === VALID_CREDS.password) {
        setStatus("success");
        setMessage("Access granted. Redirecting to dashboard…");
        setTimeout(() => onSuccess(), 800);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setStatus("locked");
          setMessage("Too many failed attempts. Account locked.");
        } else {
          setStatus("error");
          const remaining = MAX_ATTEMPTS - newAttempts;
          setMessage(
            username !== VALID_CREDS.username
              ? `Username not found. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
              : `Incorrect password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
          );
        }
      }
    }, 800);
  }, [username, password, attempts, locked, validate, onSuccess]);

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };
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
            <span className="login-brand-name">Software Admin</span>
          </div>

          <div className="login-title">Welcome back</div>
          <div className="login-subtitle">sign in to your account</div>

          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setErrors((p) => ({ ...p, username: "" })); }}
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
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              autoComplete="off"
              disabled={isDisabled}
              className={`login-input${errors.password ? " error" : ""}`}
            />
            <div className="login-hint">{errors.password || ""}</div>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={isDisabled}>
            {isLoading ? <><Spinner /> Signing in…</> : locked ? "🔒 Account Locked" : "Sign in →"}
          </button>

          {(status === "error" || status === "locked") && (
            <div className="login-feedback login-feedback--error">{message}</div>
          )}
          {status === "success" && (
            <div className="login-feedback login-feedback--success">{message}</div>
          )}

          <hr className="login-divider" />
          <div className="login-meta">
            demo: <code>admin</code> / <code>admin</code>
          </div>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetContact()
      .then(setTableRows)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="page-title">Performance Metrics</h1>
      <div className="metrics-grid">
        {metrics.map(({ label, value, badge, Icon }) => (
          <div className="metric-card" key={label}>
            <span className="metric-badge">{badge}</span>
            <div className="metric-icon-wrap"><Icon /></div>
            <div className="metric-label">{label}</div>
            <div className="metric-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="table-section">
        <div className="table-row header">
          <span className="table-cell">Name</span>
          <span className="table-cell">Email</span>
          <span className="table-cell">Date</span>
          <span className="table-cell">Subject</span>
        </div>

        {loading && (
          <div className="table-row">
            <span className="table-cell" style={{ opacity: 0.5 }}>Loading…</span>
          </div>
        )}

        {error && (
          <div className="table-row">
            <span className="table-cell" style={{ color: "#e53e3e" }}>Failed to load contacts.</span>
          </div>
        )}

        {!loading && !error && tableRows.length === 0 && (
          <div className="table-row">
            <span className="table-cell" style={{ opacity: 0.5 }}>No messages yet.</span>
          </div>
        )}

        {!loading && !error && tableRows.map((row) => (
          <div className="table-row" key={row._id}>
            <span className="table-cell">{row.name}</span>
            <span className="table-cell">{row.email}</span>
            <span className="table-cell">{new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <span className="table-cell">{row.subject}</span>
          </div>
        ))}
      </div>
    </>
  );
};

// ── Root Admin ─────────────────────────────────────────────
export const Admin = ({ theme }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [page, setPage] = useState("dashboard");

  if (!authenticated) {
    return (
      <div data-theme={theme}>
        <LoginPage onSuccess={() => setAuthenticated(true)} />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "blog":     return <AdminBlog />;
      case "projects": return <AdminProjects />;
      default:         return <Dashboard />;
    }
  };

  return (
    <div data-theme={theme}>
      <div className="admin-shell">
        <aside className="sidebar">
          <Link to="/">
            <div className="sidebar-brand">
              <span className="brand-name">Software Admin</span>
            </div>
          </Link>

          <nav>
            {NAV.map(({ id, label, Icon }) => (
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
            <div className="user-name">Admin</div>
            <div className="user-role">Administrator</div>
          </div>
        </aside>

        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Admin;