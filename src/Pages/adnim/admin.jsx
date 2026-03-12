import { useState } from "react";
import { AdminBlog } from "./AdminBlog";
import { AdminProjects } from "./AdminProjects";
import "./admin.css";
import { Link } from "react-router-dom";

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

// ── Data ───────────────────────────────────────────────────
const metrics = [
  { label: "Total Revenue",   value: "$124,500", badge: "+12%",         Icon: RevenueIcon },
  { label: "Active Projects", value: "12",       badge: "+2 this week", Icon: ProjectsMetricIcon },
  { label: "Pending Leads",   value: "5",        badge: "+5 new",       Icon: LeadsIcon },
];
const tableRows = [
  { name: "Alice Johnson", email: "alice@example.com", date: "Mar 10, 2026", subject: "Product Inquiry" },
  { name: "Bob Chen",      email: "bob@example.com",   date: "Mar 09, 2026", subject: "Support Request" },
  { name: "Sara Kim",      email: "sara@example.com",  date: "Mar 08, 2026", subject: "Partnership" },
  { name: "Mike Torres",   email: "mike@example.com",  date: "Mar 07, 2026", subject: "Demo Request" },
];

// ── Nav config ─────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "dashboard", Icon: DashboardIcon },
  { id: "projects",  label: "Projects",  Icon: ProjectsIcon  },
  { id: "blog",      label: "Blog",      Icon: BlogIcon      },
];

// ── Dashboard page ─────────────────────────────────────────
const Dashboard = () => (
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
      {tableRows.map((row) => (
        <div className="table-row" key={row.email}>
          <span className="table-cell">{row.name}</span>
          <span className="table-cell">{row.email}</span>
          <span className="table-cell">{row.date}</span>
          <span className="table-cell">{row.subject}</span>
        </div>
      ))}
    </div>
  </>
);

// ── Root Admin ─────────────────────────────────────────────
export const Admin = ({ theme }) => {
  const [page, setPage] = useState("dashboard");

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
            <div className="user-name">Name</div>
            <div className="user-role">Role</div>
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