// Reports & Exports view
const ReportsView = ({ toast, perms = {} }) => {
  const [tab, setTab] = React.useState("templates");
  const [showBuilder, setShowBuilder] = React.useState(false);
  const canExport = perms.canExport === true || perms.canExport === "limited";
  const canBuildCustom = perms.canBuildCustomReports === true;
  const canRun = canExport;

  const templates = [
    { id: 1, name: "Executive Summary", desc: "High-level KPIs for CSSP Head — total CSOs, verified counts, provincial split", icon: "chart", schedule: "Weekly · Mondays 06:00", lastRun: "2026-05-25 06:00", recipients: 4, format: "PDF + Excel" },
    { id: 2, name: "Provincial Distribution", desc: "Drill-down by province → district → city with sector breakdowns", icon: "map", schedule: "Monthly · 1st", lastRun: "2026-05-01 06:00", recipients: 12, format: "Excel + Power BI" },
    { id: 3, name: "Sector Analysis", desc: "CSO counts and coverage by sector, with multi-sector comparison", icon: "layers", schedule: "Monthly · 1st", lastRun: "2026-05-01 06:00", recipients: 8, format: "PDF" },
    { id: 4, name: "Data Quality Report", desc: "Completeness scores, duplicates, validation errors with action items", icon: "target", schedule: "Bi-weekly", lastRun: "2026-05-19 09:00", recipients: 3, format: "PDF" },
    { id: 5, name: "Registration Trends", desc: "Monthly / quarterly / yearly new registrations with growth analysis", icon: "activity", schedule: "Quarterly", lastRun: "2026-04-01 06:00", recipients: 6, format: "PDF + Excel" },
    { id: 6, name: "Activity & Usage Metrics", desc: "User logins, searches, exports — for audit and adoption tracking", icon: "users", schedule: "Monthly · 1st", lastRun: "2026-05-01 06:00", recipients: 2, format: "Excel" },
    { id: 7, name: "Audit Log Extract", desc: "Full audit trail for POPIA compliance review", icon: "shield", schedule: "Annually", lastRun: "2025-12-31 23:59", recipients: 2, format: "CSV (encrypted)" },
    { id: 8, name: "GBV Sector Deep-Dive", desc: "Custom: GBV-focused CSOs by province with funding & beneficiary stats", icon: "flag", schedule: "On demand", lastRun: "2026-05-22 14:18", recipients: 0, format: "Excel" }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports &amp; Exports</h1>
          <p className="page-sub">Generate scheduled or ad-hoc reports. All exports are logged for POPIA audit. Pre-built templates align with CSSP operational needs.</p>
        </div>
        <div className="page-header-actions">
          {canBuildCustom && (
            <button className="btn btn-secondary" onClick={() => toast("Power BI workspace opening…")}>
              <Icon name="external" size={13} /> Open Power BI workspace
            </button>
          )}
          {canBuildCustom && (
            <button className="btn btn-primary" onClick={() => setShowBuilder(true)}>
              <Icon name="plus" size={13} /> New custom report
            </button>
          )}
          {!canBuildCustom && !canRun && (
            <span className="badge"><Icon name="lock" size={10} /> View only</span>
          )}
        </div>
      </div>

      <div className="tabs">
        {[
          ["templates", "Standard templates"],
          ["scheduled", "Scheduled runs"],
          ["history", "Export history"]
        ].map(([id, l]) => (
          <div key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{l}</div>
        ))}
      </div>

      {tab === "templates" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {templates.map(t => (
            <div key={t.id} className="panel">
              <div className="panel-body">
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 7, background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center" }}>
                    <Icon name={t.icon} size={16} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.name}</div>
                    <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{t.desc}</div>
                  </div>
                </div>
                <div className="divider" style={{ margin: "10px 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11.5 }}>
                  <div><span className="muted">Schedule</span><div className="id-mono" style={{ marginTop: 2 }}>{t.schedule}</div></div>
                  <div><span className="muted">Format</span><div style={{ marginTop: 2 }}>{t.format}</div></div>
                  <div><span className="muted">Last run</span><div className="id-mono" style={{ marginTop: 2 }}>{t.lastRun}</div></div>
                  <div><span className="muted">Recipients</span><div style={{ marginTop: 2 }}>{t.recipients > 0 ? `${t.recipients} users` : "—"}</div></div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  {canRun ? (
                    <button className="btn btn-sm btn-primary" onClick={() => toast(`Running "${t.name}"…`)}>
                      <Icon name="play" size={11} /> Run now
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-secondary" disabled>
                      <Icon name="lock" size={11} /> View only
                    </button>
                  )}
                  {canBuildCustom && <button className="btn btn-sm btn-secondary"><Icon name="settings" size={11} /> Configure</button>}
                  {canExport && <button className="btn btn-sm btn-ghost"><Icon name="download" size={11} /></button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "scheduled" && (
        <div className="panel">
          <table className="table">
            <thead>
              <tr><th>Report</th><th>Cadence</th><th>Next run</th><th>Recipients</th><th>Format</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {templates.filter(t => !t.schedule.includes("demand")).map(t => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td className="id-mono">{t.schedule}</td>
                  <td className="id-mono muted">{
                    t.schedule.includes("Weekly") ? "2026-05-26 06:00" :
                    t.schedule.includes("Monthly") ? "2026-06-01 06:00" :
                    t.schedule.includes("Bi-weekly") ? "2026-06-02 09:00" :
                    t.schedule.includes("Quarterly") ? "2026-07-01 06:00" : "2026-12-31"
                  }</td>
                  <td>{t.recipients} users</td>
                  <td>{t.format}</td>
                  <td><span className="badge verified"><span className="dot"></span> Active</span></td>
                  <td><button className="btn btn-sm btn-ghost"><Icon name="moreH" size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "history" && (
        <div className="panel">
          <table className="table">
            <thead>
              <tr><th>Export ID</th><th>Report / Query</th><th>Records</th><th>Format</th><th>User</th><th>Timestamp</th><th>Filters applied</th></tr>
            </thead>
            <tbody>
              {[
                ["EXP-04421", "Search results — GBV in KZN", 14, "Excel", "P. Naidoo", "2026-05-25 14:32", "sector=GBV; province=KZN"],
                ["EXP-04420", "Executive Summary", "—", "PDF", "L. Mothapo", "2026-05-25 06:00", "auto-scheduled"],
                ["EXP-04419", "Sector Analysis Q2", 420, "Excel", "T. Nkosi", "2026-05-25 09:14", "all sectors"],
                ["EXP-04418", "Search results — Self-reg pending", 47, "CSV", "L. Mothapo", "2026-05-24 16:08", "status=Pending"],
                ["EXP-04417", "Provincial Distribution", 9, "Excel", "S. Dlamini", "2026-05-24 11:30", "—"],
                ["EXP-04416", "Custom: Free State food security", 18, "Excel", "B. Mokoena", "2026-05-23 14:55", "province=FS; sector=Food"],
                ["EXP-04415", "Data Quality Report", "—", "PDF", "System", "2026-05-19 09:00", "auto-scheduled"]
              ].map((r, i) => (
                <tr key={i}>
                  <td className="id-mono">{r[0]}</td>
                  <td>{r[1]}</td>
                  <td className="id-mono">{r[2]}</td>
                  <td><span className="badge">{r[3]}</span></td>
                  <td>{r[4]}</td>
                  <td className="id-mono muted">{r[5]}</td>
                  <td className="muted" style={{ fontSize: 11.5, fontFamily: "var(--font-mono)" }}>{r[6]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showBuilder && <ReportBuilderModal onClose={() => setShowBuilder(false)} toast={toast} />}
    </div>
  );
};

const ReportBuilderModal = ({ onClose, toast }) => {
  const [name, setName] = React.useState("Untitled report");
  const [cols, setCols] = React.useState(["name", "cso_number", "province", "sector", "status"]);
  const allCols = [
    "name", "cso_number", "type", "province", "district", "city",
    "sector", "director", "contact", "email", "phone", "dateReg",
    "completeness", "status", "beneficiaries", "staff", "funding"
  ];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">New custom report</div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="field" style={{ marginBottom: 14 }}>
            <label className="field-label">Report name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label className="field-label">Columns to include</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allCols.map(c => {
                const on = cols.includes(c);
                return (
                  <label key={c} className="checkbox" style={{ padding: "4px 9px", border: "1px solid var(--border)", borderRadius: 4, background: on ? "var(--primary-soft)" : "var(--panel)", borderColor: on ? "var(--primary)" : "var(--border)", color: on ? "var(--primary)" : "" }}>
                    <input type="checkbox" checked={on} onChange={() => setCols(on ? cols.filter(x => x !== c) : [...cols, c])} />
                    {c}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label className="field-label">Format</label>
            <select className="select"><option>Excel (.xlsx)</option><option>CSV</option><option>PDF</option><option>JSON</option></select>
          </div>
          <div className="field">
            <label className="field-label">Schedule</label>
            <select className="select"><option>On demand</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-secondary" onClick={() => { onClose(); toast("Report saved as draft"); }}>Save draft</button>
          <button className="btn btn-primary" onClick={() => { onClose(); toast(`Generated "${name}" — ${cols.length} columns`); }}>Generate now</button>
        </div>
      </div>
    </div>
  );
};

window.ReportsView = ReportsView;
