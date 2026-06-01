// Admin & audit
const AdminView = ({ toast }) => {
  const [tab, setTab] = React.useState("users");

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Administration</h1>
          <p className="page-sub">User access, audit log, system settings, and POPIA compliance controls. Logs retained for 7 years.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="download" size={13} /> Export audit (CSV)</button>
          <button className="btn btn-primary"><Icon name="plus" size={13} /> Invite user</button>
        </div>
      </div>

      <div className="tabs">
        {[
          ["users", "Users & roles"],
          ["audit", "Audit log"],
          ["security", "Security"],
          ["popia", "POPIA & compliance"],
          ["programme", "Programme delivery"],
          ["system", "System health"]
        ].map(([id, l]) => (
          <div key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{l}</div>
        ))}
      </div>

      {tab === "users" && (
        <>
          <div className="kpi-grid">
            <div className="kpi">
              <div className="kpi-label">Total users <Icon name="users" size={13} /></div>
              <div className="kpi-value">{USERS.length}</div>
              <div className="kpi-foot"><span className="muted">{USERS.filter(u => u.status === "Active").length} active</span></div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Power users <Icon name="bolt" size={13} /></div>
              <div className="kpi-value">{USERS.filter(u => u.role === "Power User").length}</div>
              <div className="kpi-foot"><span className="muted">programme managers</span></div>
            </div>
            <div className="kpi">
              <div className="kpi-label">MFA enabled <Icon name="shield" size={13} /></div>
              <div className="kpi-value">100%</div>
              <div className="kpi-foot"><span className="muted">via Azure AD</span></div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Avg session <Icon name="clock" size={13} /></div>
              <div className="kpi-value">14 min</div>
              <div className="kpi-foot"><span className="muted">timeout at 30 min</span></div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div className="panel-title"><Icon name="users" size={14} /> Users</div>
              <div style={{ display: "flex", gap: 6 }}>
                <select className="select" style={{ width: 130 }}><option>All roles</option>{["Admin", "Power User", "Standard", "Read-Only"].map(r => <option key={r}>{r}</option>)}</select>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", border: "1px solid var(--border)", borderRadius: 5 }}>
                  <Icon name="search" size={12} className="muted" />
                  <input placeholder="Search users" style={{ border: 0, outline: 0, fontSize: 12, background: "transparent", width: 140 }} />
                </div>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr><th>User</th><th>Role</th><th>Department</th><th>Last login</th><th>MFA</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {USERS.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>{u.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
                        <div>
                          <div style={{ fontWeight: 500 }}>{u.name}</div>
                          <div className="muted" style={{ fontSize: 11 }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === "Admin" ? "accent" : u.role === "Power User" ? "info" : u.role === "Read-Only" ? "" : "verified"}`}>{u.role}</span>
                    </td>
                    <td>{u.dept}</td>
                    <td className="id-mono muted">{u.lastLogin}</td>
                    <td><span className="badge verified"><Icon name="check" size={9} /> AAD</span></td>
                    <td><span className={`badge ${u.status === "Active" ? "verified" : ""}`}>{u.status}</span></td>
                    <td><button className="btn btn-sm btn-ghost"><Icon name="moreH" size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel" style={{ marginTop: 16 }}>
            <div className="panel-head">
              <div className="panel-title"><Icon name="lock" size={14} /> Role permissions matrix</div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Permission</th><th style={{ textAlign: "center" }}>Admin</th><th style={{ textAlign: "center" }}>Power User</th>
                  <th style={{ textAlign: "center" }}>Standard</th><th style={{ textAlign: "center" }}>Read-Only</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Search & view profiles", "✓", "✓", "✓", "✓"],
                  ["Export to Excel", "✓", "✓", "Limited", "—"],
                  ["Bulk export (>1,000 records)", "✓", "✓", "—", "—"],
                  ["Edit CSO profiles", "✓", "✓", "—", "—"],
                  ["Approve self-registrations", "✓", "✓", "—", "—"],
                  ["Run data pipelines", "✓", "—", "—", "—"],
                  ["Configure matching rules", "✓", "—", "—", "—"],
                  ["Manage users & roles", "✓", "—", "—", "—"],
                  ["Build custom reports", "✓", "✓", "—", "—"],
                  ["Access audit log", "✓", "View only", "—", "—"]
                ].map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r[0]}</strong></td>
                    {r.slice(1).map((v, j) => (
                      <td key={j} style={{ textAlign: "center", fontFamily: v === "✓" || v === "—" ? "var(--font-mono)" : "inherit", fontSize: v === "✓" || v === "—" ? 13 : 11.5, color: v === "—" ? "var(--muted)" : v === "✓" ? "var(--primary)" : "var(--warn)" }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "audit" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
            <select className="select" style={{ width: 140 }}><option>All actions</option><option>VIEW</option><option>EXPORT</option><option>UPDATE</option><option>MERGE</option><option>INGEST</option></select>
            <select className="select" style={{ width: 160 }}><option>All users</option>{USERS.map(u => <option key={u.id}>{u.name}</option>)}</select>
            <input className="input" type="date" defaultValue="2026-05-20" style={{ width: 150 }} />
            <span className="muted" style={{ fontSize: 12 }}>to</span>
            <input className="input" type="date" defaultValue="2026-05-25" style={{ width: 150 }} />
            <div style={{ flex: 1 }} />
            <span className="muted" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>tamper-evident · 7y retention</span>
          </div>
          <div className="panel">
            <table className="table">
              <thead>
                <tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Target</th><th>IP</th></tr>
              </thead>
              <tbody>
                {AUDIT_LOG.map(e => (
                  <tr key={e.id}>
                    <td className="id-mono muted">{e.ts}</td>
                    <td>{e.user}</td>
                    <td><span className="badge">{e.role}</span></td>
                    <td><span className={`badge ${e.action === "EXPORT" ? "accent" : e.action === "INGEST" ? "info" : e.action === "CREATE" ? "verified" : e.action === "MERGE" ? "flagged" : ""}`}>{e.action}</span></td>
                    <td>{e.target}</td>
                    <td className="id-mono muted">{e.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "security" && (
        <div className="split-2">
          <div className="panel">
            <div className="panel-head"><div className="panel-title"><Icon name="shield" size={14} /> Authentication</div></div>
            <div className="panel-body">
              <ConfigRow label="SSO provider" value="Azure AD (Kagiso tenant)" badge="active" />
              <ConfigRow label="MFA enforcement" value="Required for all users" badge="active" />
              <ConfigRow label="Session timeout" value="30 minutes idle" />
              <ConfigRow label="Password policy" value="12+ chars, complexity required" />
              <ConfigRow label="Concurrent sessions" value="Max 3 per user" />
              <ConfigRow label="Failed login lockout" value="5 attempts → 15 min" />
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title"><Icon name="lock" size={14} /> Data protection</div></div>
            <div className="panel-body">
              <ConfigRow label="Encryption at rest" value="AES-256 (Azure Storage)" badge="active" />
              <ConfigRow label="Encryption in transit" value="TLS 1.3 enforced" badge="active" />
              <ConfigRow label="Backup cadence" value="Daily 02:00 SAST" />
              <ConfigRow label="RPO / RTO" value="1 hour / 4 hours" />
              <ConfigRow label="Data residency" value="South Africa North (Azure)" badge="active" />
              <ConfigRow label="Vulnerability scan" value="Weekly · last: 2026-05-19" />
            </div>
          </div>
        </div>
      )}

      {tab === "popia" && (
        <div>
          <div className="panel" style={{ marginBottom: 12 }}>
            <div className="panel-head"><div className="panel-title"><Icon name="shield" size={14} /> POPIA compliance status</div><span className="badge verified"><span className="dot"></span> Compliant</span></div>
            <div className="panel-body">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <PopiaCard title="Lawful processing" status="Compliant" desc="Consent obtained at registration; legitimate interest documented for ingest from government registries." />
                <PopiaCard title="Purpose limitation" status="Compliant" desc="Data used only for CSSP programme delivery; sharing requires user role + audit." />
                <PopiaCard title="Data minimisation" status="Compliant" desc="Only required fields captured; profile editing prompts review of necessity." />
                <PopiaCard title="Subject access" status="Compliant" desc="Self-service via portal; full data export within 30 days of request." />
              </div>
            </div>
          </div>

          <div className="split-2">
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Subject access requests</div></div>
              <table className="table">
                <thead><tr><th>Ref</th><th>Type</th><th>Submitted</th><th>SLA</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td className="id-mono">SAR-0042</td><td>Access</td><td className="id-mono muted">2026-05-20</td><td>25 days remaining</td><td><span className="badge pending">In progress</span></td></tr>
                  <tr><td className="id-mono">SAR-0041</td><td>Correction</td><td className="id-mono muted">2026-05-18</td><td>Closed</td><td><span className="badge verified">Resolved</span></td></tr>
                  <tr><td className="id-mono">SAR-0040</td><td>Deletion</td><td className="id-mono muted">2026-04-22</td><td>Closed</td><td><span className="badge verified">Resolved</span></td></tr>
                  <tr><td className="id-mono">SAR-0039</td><td>Access</td><td className="id-mono muted">2026-04-15</td><td>Closed</td><td><span className="badge verified">Resolved</span></td></tr>
                </tbody>
              </table>
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Breach notification log</div></div>
              <div className="empty" style={{ padding: 32 }}>
                <Icon name="check" size={26} className="muted" />
                <div style={{ marginTop: 8 }}>No reportable breaches in the last 365 days.</div>
                <div style={{ marginTop: 4, fontSize: 11.5 }}>Per SEC-FR-16: breaches notified to Kagiso within 1 hour.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "programme" && <ProgrammeDeliveryTab />}

      {tab === "system" && (
        <div>
          <div className="kpi-grid">
            <div className="kpi"><div className="kpi-label">Uptime (30d)</div><div className="kpi-value">99.97%</div><div className="kpi-foot"><span className="muted">SLA 99.5%</span></div></div>
            <div className="kpi"><div className="kpi-label">Avg search response</div><div className="kpi-value">1.4s</div><div className="kpi-foot"><span className="muted">target &lt;3s</span></div></div>
            <div className="kpi"><div className="kpi-label">Database size</div><div className="kpi-value">412 MB</div><div className="kpi-foot"><span className="muted">+12 MB this month</span></div></div>
            <div className="kpi"><div className="kpi-label">Active sessions</div><div className="kpi-value">22</div><div className="kpi-foot"><span className="muted">peak 41 (10:30 SAST)</span></div></div>
          </div>

          <div className="split-2">
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Service status</div></div>
              <div className="panel-body" style={{ paddingTop: 6 }}>
                {[
                  ["Database (Azure SQL)", "Healthy"],
                  ["Search index (Elastic)", "Healthy"],
                  ["File storage (SharePoint)", "Healthy"],
                  ["Identity (Azure AD)", "Healthy"],
                  ["Power BI workspace", "Healthy"],
                  ["DSD pipeline runner", "Healthy"],
                  ["SARS pipeline runner", "Degraded — schema drift"],
                  ["Email service (SendGrid)", "Healthy"]
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 7 ? "1px solid var(--border)" : "none", fontSize: 12.5 }}>
                    <span>{s[0]}</span>
                    <span><span className={`dot ${s[1] === "Healthy" ? "green" : "amber"}`}></span>{s[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title">Capacity</div></div>
              <div className="panel-body">
                <CapacityRow label="Storage used" value={412} max={20480} unit="MB" />
                <CapacityRow label="Concurrent users" value={22} max={500} unit="" />
                <CapacityRow label="API calls (24h)" value={18432} max={500000} unit="" />
                <CapacityRow label="Records" value={420} max={500000} unit="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ConfigRow = ({ label, value, badge }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 12.5 }}>
    <span className="muted">{label}</span>
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span>{value}</span>
      {badge && <span className="badge verified"><span className="dot"></span> {badge}</span>}
    </span>
  </div>
);

const PopiaCard = ({ title, status, desc }) => (
  <div style={{ padding: 14, border: "1px solid var(--border)", borderRadius: 7 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <strong style={{ fontSize: 12.5 }}>{title}</strong>
      <span className="badge verified"><Icon name="check" size={9} /></span>
    </div>
    <div className="muted" style={{ fontSize: 11.5, lineHeight: 1.45 }}>{desc}</div>
  </div>
);

const CapacityRow = ({ label, value, max, unit }) => {
  const pct = (value / max) * 100;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
        <span>{label}</span>
        <span className="id-mono">{value.toLocaleString()}{unit} / {max.toLocaleString()}{unit}</span>
      </div>
      <div style={{ height: 6, background: "var(--bg-2)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: pct > 80 ? "var(--warn)" : "var(--primary)" }} />
      </div>
    </div>
  );
};

const ProgrammeDeliveryTab = () => {
  const phases = [
    { name: "Database Development", start: "Mar 2026", end: "Mar 2026", status: "complete", pct: 100, deliverable: "Deployed database system", activities: ["Data pipeline development", "UI development", "M365 integration"] },
    { name: "Database Testing & Launch", start: "Apr 2026", end: "Apr 2026", status: "complete", pct: 100, deliverable: "Live database system", activities: ["UAT, security testing", "User training", "Go-live"] },
    { name: "Database Pilot", start: "Apr 2026", end: "Jun 2026", status: "active", pct: 68, deliverable: "Pilot evaluation report", activities: ["Pilot with ~1,132 CSOs", "Feedback collection", "Iterative improvements"] },
    { name: "Trading Hub Development", start: "Apr 2026", end: "Jun 2026", status: "active", pct: 42, deliverable: "Trading Hub system", activities: ["Platform development", "Integration with DB", "Matching algorithms"] },
    { name: "Trading Hub Testing & Launch", start: "Jul 2026", end: "Dec 2026", status: "planned", pct: 0, deliverable: "Live Trading Hub", activities: ["Testing, UAT", "User training", "Go-live"] }
  ];

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi"><div className="kpi-label">Programme phase</div><div className="kpi-value" style={{ fontSize: 22 }}>Database Pilot</div><div className="kpi-foot"><span className="muted">Apr — Jun 2026</span></div></div>
        <div className="kpi"><div className="kpi-label">Budget</div><div className="kpi-value">R500k</div><div className="kpi-foot"><span className="muted">milestone-based</span></div></div>
        <div className="kpi"><div className="kpi-label">Milestones met</div><div className="kpi-value">2 / 3</div><div className="kpi-foot"><span className="kpi-delta up">on schedule</span></div></div>
        <div className="kpi"><div className="kpi-label">Risk status</div><div className="kpi-value" style={{ color: "var(--warn)", fontSize: 22 }}>Amber</div><div className="kpi-foot"><span className="muted">1 amber · SARS pipeline</span></div></div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div className="panel-title"><Icon name="activity" size={14} /> Implementation timeline</div>
          <span className="panel-sub">Mar 2026 — Dec 2026</span>
        </div>
        <div className="panel-body">
          {phases.map((p, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "260px 1fr 110px", gap: 18, padding: "14px 0", borderBottom: i < phases.length - 1 ? "1px solid var(--border)" : "none", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.name}</div>
                <div className="muted" style={{ fontSize: 11, fontFamily: "var(--font-mono)", marginTop: 2 }}>{p.start} → {p.end}</div>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>{p.activities.join(" · ")}</div>
              </div>
              <div>
                <div style={{ height: 10, background: "var(--bg-2)", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${p.pct}%`, height: "100%", background: p.status === "complete" ? "var(--olive)" : p.status === "active" ? "var(--primary)" : "var(--border-strong)", borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                  <span>{p.deliverable}</span>
                  <span>{p.pct}%</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className={`badge ${p.status === "complete" ? "verified" : p.status === "active" ? "accent" : ""}`}>
                  {p.status === "complete" ? "✓ Complete" : p.status === "active" ? "In flight" : "Planned"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="split-2" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><Icon name="check" size={14} /> Milestone schedule</div></div>
          <table className="table">
            <thead><tr><th>Milestone</th><th>Date</th><th>Status</th><th>Payment</th></tr></thead>
            <tbody>
              <tr><td><strong>M1</strong> · Contract & Requirements signed</td><td className="id-mono muted">2026-03-20</td><td><span className="badge verified">✓ Met</span></td><td className="id-mono">R125k released</td></tr>
              <tr><td><strong>M2</strong> · Database deployed & UAT passed</td><td className="id-mono muted">2026-04-30</td><td><span className="badge verified">✓ Met</span></td><td className="id-mono">R250k released</td></tr>
              <tr><td><strong>M3</strong> · Pilot complete & sign-off</td><td className="id-mono muted">2026-06-30</td><td><span className="badge pending">In progress</span></td><td className="id-mono muted">R125k pending</td></tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title"><Icon name="warn" size={14} /> Risk register</div></div>
          <table className="table">
            <thead><tr><th>Risk</th><th>L</th><th>I</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Data quality issues in source datasets</td><td className="id-mono">H</td><td className="id-mono">M</td><td><span className="badge verified">Mitigated</span></td></tr>
              <tr><td>M365 integration challenges</td><td className="id-mono">M</td><td className="id-mono">M</td><td><span className="badge verified">Resolved</span></td></tr>
              <tr><td>Scope creep during development</td><td className="id-mono">H</td><td className="id-mono">M</td><td><span className="badge verified">Controlled</span></td></tr>
              <tr><td>SARS schema drift (active)</td><td className="id-mono">M</td><td className="id-mono">M</td><td><span className="badge pending">Open</span></td></tr>
              <tr><td>Resource availability (Kagiso)</td><td className="id-mono">M</td><td className="id-mono">M</td><td><span className="badge verified">Controlled</span></td></tr>
              <tr><td>UAT timeline compression</td><td className="id-mono">M</td><td className="id-mono">M</td><td><span className="badge verified">Resolved</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><div className="panel-title"><Icon name="target" size={14} /> KPIs vs targets</div></div>
        <table className="table">
          <thead><tr><th>KPI</th><th>Baseline</th><th>Target</th><th>Current</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Records imported</td><td className="id-mono">0</td><td className="id-mono">400,000+</td><td className="id-mono"><strong>401,438</strong></td><td><span className="badge verified">✓ Met</span></td></tr>
            <tr><td>Data completeness</td><td className="muted">N/A</td><td className="id-mono">≥85%</td><td className="id-mono"><strong>72%</strong></td><td><span className="badge pending">Below target</span></td></tr>
            <tr><td>Search response time</td><td className="muted">N/A</td><td className="id-mono">&lt;3 sec</td><td className="id-mono"><strong>1.4s</strong></td><td><span className="badge verified">✓ Met</span></td></tr>
            <tr><td>System uptime</td><td className="muted">N/A</td><td className="id-mono">99.5%</td><td className="id-mono"><strong>99.97%</strong></td><td><span className="badge verified">✓ Exceeds</span></td></tr>
            <tr><td>User adoption</td><td className="id-mono">0</td><td className="id-mono">50+ active</td><td className="id-mono"><strong>68</strong></td><td><span className="badge verified">✓ Exceeds</span></td></tr>
            <tr><td>Reports generated</td><td className="id-mono">0</td><td className="id-mono">100+ / month</td><td className="id-mono"><strong>142</strong></td><td><span className="badge verified">✓ Exceeds</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

window.AdminView = AdminView;
