// Main app — wires together login, navigation, pages
const { useState, useEffect } = React;

// Role-based permission matrix — drives nav, page access and in-page actions
const PERMS = {
  "Admin": {
    nav: ["dashboard", "search", "quality", "reports", "ingestion", "selfreg", "admin", "help"],
    canExport: true, canBulkExport: true, canEdit: true, canApprove: true,
    canRunPipelines: true, canConfigureSystem: true, canManageUsers: true,
    canBuildCustomReports: true, canViewAudit: true,
    dashboardVariant: "full",
    badgeTone: "accent"
  },
  "Power User": {
    nav: ["dashboard", "search", "quality", "reports", "ingestion", "selfreg", "help"],
    canExport: true, canBulkExport: true, canEdit: true, canApprove: true,
    canRunPipelines: false, canConfigureSystem: false, canManageUsers: false,
    canBuildCustomReports: true, canViewAudit: "view-only",
    dashboardVariant: "full",
    badgeTone: "info"
  },
  "Standard": {
    nav: ["dashboard", "search", "reports", "help"],
    canExport: "limited", canBulkExport: false, canEdit: false, canApprove: false,
    canRunPipelines: false, canConfigureSystem: false, canManageUsers: false,
    canBuildCustomReports: false, canViewAudit: false,
    dashboardVariant: "standard",
    badgeTone: "verified"
  },
  "Read-Only": {
    nav: ["dashboard", "search", "help"],
    canExport: false, canBulkExport: false, canEdit: false, canApprove: false,
    canRunPipelines: false, canConfigureSystem: false, canManageUsers: false,
    canBuildCustomReports: false, canViewAudit: false,
    dashboardVariant: "exec",
    badgeTone: ""
  }
};

const App = () => {
  const [auth, setAuth] = useState(null); // null | {email, role} | {public: true}
  const [route, setRoute] = useState("dashboard");
  const [activeProfile, setActiveProfile] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const toast = (msg) => {
    const id = Math.random();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };

  useEffect(() => {
    window.__navProfile = (cso) => { setActiveProfile(cso); };
    const onKey = (e) => {
      if (e.key === "Escape" && activeProfile) {
        setActiveProfile(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeProfile]);

  // Reset route to dashboard when role changes (in case route is now forbidden)
  useEffect(() => {
    if (auth && !auth.public) {
      const allowed = PERMS[auth.role]?.nav || ["dashboard"];
      if (!allowed.includes(route)) setRoute("dashboard");
    }
  }, [auth?.role]);

  if (!auth) return <LoginScreen onLogin={setAuth} />;
  if (auth.public) return <SelfRegPortal onExit={() => setAuth(null)} />;

  const perms = PERMS[auth.role] || PERMS["Read-Only"];

  const navTo = (r) => {
    if (!perms.nav.includes(r)) {
      toast(`Access denied — ${auth.role} cannot view ${r}`);
      return;
    }
    setRoute(r);
    setActiveProfile(null);
  };

  const openProfile = (cso) => {
    setActiveProfile(cso);
    window.scrollTo(0, 0);
  };

  const allNavItems = [
    { section: "Workspace" },
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "search", label: "Search CSOs", icon: "search", count: CSO_DATA.length.toLocaleString() },
    { id: "quality", label: "Data Quality", icon: "target", count: "3" },
    { id: "reports", label: "Reports", icon: "chart" },
    { section: "Data" },
    { id: "ingestion", label: "Ingestion", icon: "database" },
    { id: "selfreg", label: "Self-reg queue", icon: "user", count: "47" },
    { section: "Admin" },
    { id: "admin", label: "Administration", icon: "shield" },
    { id: "help", label: "Help & Training", icon: "book" }
  ];

  // Filter out section headers whose children are all hidden
  const navItems = (() => {
    const out = [];
    let pending = null;
    for (const it of allNavItems) {
      if (it.section) {
        pending = it;
      } else if (perms.nav.includes(it.id)) {
        if (pending) { out.push(pending); pending = null; }
        out.push(it);
      }
    }
    return out;
  })();

  const crumbs = {
    dashboard: ["Workspace", "Dashboard"],
    search: ["Workspace", "Search CSOs"],
    quality: ["Workspace", "Data Quality"],
    reports: ["Workspace", "Reports"],
    ingestion: ["Data", "Ingestion"],
    selfreg: ["Data", "Self-registration queue"],
    admin: ["Admin", "Administration"],
    help: ["Admin", "Help & Training"]
  };

  const userName = auth.email.split("@")[0].split(".").map(s => s[0].toUpperCase() + s.slice(1)).join(" ");
  const userInitials = auth.email.split("@")[0].split(".").map(p => p[0].toUpperCase()).join("");

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <img src="assets/kagiso-bird.png" alt="Kagiso Trust" style={{ height: 28 }} />
          <div className="brand-text">
            <span className="brand-title">CSO Database</span>
            <span className="brand-sub">Kagiso Trust · CSSP</span>
          </div>
        </div>

        <div className="nav-section" style={{ flex: 1, overflowY: "auto" }}>
          {navItems.map((item, i) => {
            if (item.section) {
              return <div key={i} className="nav-label">{item.section}</div>;
            }
            return (
              <div
                key={item.id}
                className={`nav-item ${route === item.id && !activeProfile ? "active" : ""}`}
                onClick={() => navTo(item.id)}
              >
                <Icon name={item.icon} size={15} />
                <span>{item.label}</span>
                {item.count && <span className="nav-count">{item.count}</span>}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "0 10px 12px" }}>
          <div style={{ padding: "11px 12px", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <Icon name="sparkle" size={12} className="muted" />
              <span style={{ fontSize: 11.5, fontWeight: 500 }}>Trading Hub</span>
              <span className="badge accent" style={{ fontSize: 9, padding: "0 4px" }}>SOON</span>
            </div>
            <div className="muted" style={{ fontSize: 10.5, lineHeight: 1.4 }}>
              Marketplace launching Q3 — built on this database.
            </div>
          </div>
        </div>

        <div className="sidebar-foot">
          <span className="avatar">{userInitials}</span>
          <div className="user-meta">
            <span className="un">{userName}</span>
            <span className="ur">{auth.role}</span>
          </div>
          <button className="icon-btn" title="Sign out" onClick={() => { setAuth(null); setRoute("dashboard"); }}><Icon name="logout" size={14} /></button>
        </div>
      </div>

      {/* Main column */}
      <div className="main">
        <div className="topbar">
          <div className="crumbs">
            {(crumbs[route] || []).map((c, i, arr) => (
              <React.Fragment key={i}>
                <span className={i === arr.length - 1 && !activeProfile ? "cur" : ""}>{c}</span>
                {(i < arr.length - 1 || activeProfile) && <Icon name="chevronRight" size={12} className="sep" />}
              </React.Fragment>
            ))}
            {activeProfile && <span className="cur">{activeProfile.name}</span>}
          </div>
          <div className="topbar-spacer" />
          <div className="topbar-search">
            <Icon name="search" size={14} />
            <span style={{ flex: 1 }}>Quick search…</span>
            <span className="kbd">⌘K</span>
          </div>
          <div className="topbar-actions">
            <span className={`badge ${perms.badgeTone}`} title="Your role determines what you can do" style={{ marginRight: 6 }}>
              <Icon name="lock" size={9} />
              {auth.role}
            </span>
            <button className="icon-btn" title="Help" onClick={() => navTo("help")}><Icon name="info" size={16} /></button>
            <button className="icon-btn" title="Notifications" onClick={() => setNotifOpen(!notifOpen)} style={{ background: notifOpen ? "rgba(20, 18, 12, 0.06)" : "transparent" }}>
              <Icon name="bell" size={16} />
              <span className="dot"></span>
            </button>
            {perms.canManageUsers && (
              <button className="icon-btn" title="Settings" onClick={() => navTo("admin")}><Icon name="settings" size={16} /></button>
            )}
          </div>
        </div>

        {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} onNav={navTo} />}

        <div className="page">
          {activeProfile ? (
            <ProfileView cso={activeProfile} onBack={() => setActiveProfile(null)} role={auth.role} perms={perms} toast={toast} />
          ) : (
            <>
              {route === "dashboard" && <Dashboard user={auth} perms={perms} onNav={navTo} />}
              {route === "search" && <SearchView onOpenProfile={openProfile} role={auth.role} perms={perms} toast={toast} />}
              {route === "quality" && <QualityView toast={toast} perms={perms} />}
              {route === "reports" && <ReportsView toast={toast} perms={perms} />}
              {route === "ingestion" && <IngestionView toast={toast} perms={perms} />}
              {route === "selfreg" && <SelfRegQueueView onOpenProfile={openProfile} toast={toast} perms={perms} />}
              {route === "admin" && <AdminView toast={toast} perms={perms} />}
              {route === "help" && <HelpView toast={toast} />}
            </>
          )}
        </div>
      </div>

      {/* Toasts */}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <Icon name="check" size={13} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

// Self-reg queue — pending submissions awaiting verification
const SelfRegQueueView = ({ onOpenProfile, toast, perms }) => {
  const pending = CSO_DATA.filter(c => c.sources.includes("Self-Reg")).slice(0, 12);
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Self-Registration Queue</h1>
          <p className="page-sub">CSO-submitted profiles awaiting CSSP verification. SLA: 5 working days from submission.</p>
        </div>
        <div className="page-header-actions">
          {perms.canExport && <button className="btn btn-secondary"><Icon name="download" size={13} /> Export queue</button>}
          {perms.canApprove && <button className="btn btn-primary"><Icon name="check" size={13} /> Bulk approve</button>}
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi"><div className="kpi-label">Pending</div><div className="kpi-value">47</div><div className="kpi-foot"><span className="muted">avg age 2.1 days</span></div></div>
        <div className="kpi"><div className="kpi-label">Approved (30d)</div><div className="kpi-value">128</div><div className="kpi-foot"><span className="kpi-delta up">+18%</span></div></div>
        <div className="kpi"><div className="kpi-label">Rejected (30d)</div><div className="kpi-value">12</div><div className="kpi-foot"><span className="muted">duplicate or invalid</span></div></div>
        <div className="kpi"><div className="kpi-label">Avg processing time</div><div className="kpi-value">2.1d</div><div className="kpi-foot"><span className="muted">SLA 5d</span></div></div>
      </div>

      <div className="panel">
        <table className="table">
          <thead>
            <tr><th>Submitted</th><th>Organisation</th><th>Province</th><th>Sector</th><th>Documents</th><th>Verification</th><th></th></tr>
          </thead>
          <tbody>
            {pending.map(c => (
              <tr key={c.id}>
                <td className="id-mono muted">2026-05-{String(20 + (c.id % 5)).padStart(2, '0')}</td>
                <td>
                  <strong style={{ cursor: "pointer" }} onClick={() => onOpenProfile(c)}>{c.name}</strong>
                  <div className="muted" style={{ fontSize: 11 }}>{c.cso_number} · {c.type}</div>
                </td>
                <td>{c.province}</td>
                <td><span className="badge">{c.sector}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 3 }}>
                    <span className="badge verified" title="NPO Cert"><Icon name="file" size={9}/> NPO</span>
                    {c.sarsExempt && <span className="badge verified" title="SARS PBO"><Icon name="file" size={9}/> SARS</span>}
                    <span className="badge"><Icon name="file" size={9}/> AFS</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="dot amber"></span>
                    <span style={{ fontSize: 12 }}>Awaiting review</span>
                  </div>
                </td>
                <td style={{ display: "flex", gap: 4 }}>
                  {perms.canApprove ? (
                    <>
                      <button className="btn btn-sm btn-primary" onClick={() => toast(`Approved: ${c.name}`)}><Icon name="check" size={11} /></button>
                      <button className="btn btn-sm btn-secondary"><Icon name="eye" size={11} /></button>
                      <button className="btn btn-sm btn-ghost"><Icon name="x" size={11} /></button>
                    </>
                  ) : (
                    <button className="btn btn-sm btn-secondary"><Icon name="eye" size={11} /> View</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

window.SelfRegQueueView = SelfRegQueueView;
window.PERMS = PERMS;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
