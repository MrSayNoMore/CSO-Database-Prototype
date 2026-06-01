// Help & Documentation, Training, Support
const HelpView = ({ toast }) => {
  const [tab, setTab] = React.useState("docs");

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Help &amp; Training</h1>
          <p className="page-sub">User documentation, training materials, and support — accessible to all users in line with the BRD usability requirements (NFR-17).</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="download" size={13} /> Download user manual (PDF)</button>
          <button className="btn btn-primary"><Icon name="mail" size={13} /> Contact support</button>
        </div>
      </div>

      <div className="tabs">
        {[
          ["docs", "Documentation"],
          ["training", "Training & onboarding"],
          ["faq", "FAQ"],
          ["releases", "Release notes"],
          ["support", "Support & contact"]
        ].map(([id, l]) => (
          <div key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{l}</div>
        ))}
      </div>

      {tab === "docs" && (
        <div className="split-23">
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {[
                { icon: "book", title: "Quick start guide", desc: "5-minute overview for new users — login, search, export.", time: "3 min read", role: "All users" },
                { icon: "search", title: "Advanced search techniques", desc: "Combine filters, save searches, and use boolean operators.", time: "6 min read", role: "All users" },
                { icon: "download", title: "Exporting & reporting", desc: "Generate Excel exports and configure scheduled reports.", time: "5 min read", role: "Power User+" },
                { icon: "database", title: "Data ingestion playbook", desc: "Running pipelines, handling schema drift, manual uploads.", time: "12 min read", role: "Admin" },
                { icon: "git", title: "Deduplication workflow", desc: "Reviewing match clusters and merge decisions.", time: "8 min read", role: "Power User+" },
                { icon: "target", title: "Data quality framework", desc: "Completeness scoring, validation rules, remediation queues.", time: "10 min read", role: "Power User+" },
                { icon: "shield", title: "POPIA compliance handbook", desc: "Subject access requests, breach response, audit procedures.", time: "15 min read", role: "Admin / Legal" },
                { icon: "external", title: "Power BI integration guide", desc: "Connecting workspaces, refreshing data, custom dashboards.", time: "9 min read", role: "Power User+" }
              ].map((d, i) => (
                <div key={i} className="panel" style={{ cursor: "pointer" }}>
                  <div className="panel-body">
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ width: 32, height: 32, borderRadius: 6, background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <Icon name={d.icon} size={14} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{d.title}</div>
                        <div className="muted" style={{ fontSize: 12, marginTop: 3, lineHeight: 1.45 }}>{d.desc}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <span className="badge"><Icon name="clock" size={9} /> {d.time}</span>
                          <span className="badge info">{d.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title"><Icon name="folder" size={14} /> Reference</div></div>
              <div className="panel-body" style={{ padding: 0 }}>
                {[
                  ["Business Requirements Document v0.2", "PDF · 2.1 MB"],
                  ["Data dictionary", "PDF · 412 KB"],
                  ["Field validation rules reference", "PDF · 188 KB"],
                  ["Sector taxonomy (15 sectors)", "PDF · 92 KB"],
                  ["Province / district reference data", "Excel · 240 KB"],
                  ["API specification (OpenAPI 3.1)", "JSON · 84 KB"]
                ].map((d, i) => (
                  <div key={i} style={{ padding: "10px 16px", borderBottom: i < 5 ? "1px solid var(--border)" : "none", display: "flex", gap: 10, alignItems: "center", fontSize: 12.5, cursor: "pointer" }}>
                    <Icon name="file" size={14} className="muted" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{d[0]}</div>
                      <div className="muted" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>{d[1]}</div>
                    </div>
                    <Icon name="download" size={13} className="muted" />
                  </div>
                ))}
              </div>
            </div>

            <div className="panel" style={{ marginTop: 12 }}>
              <div className="panel-head"><div className="panel-title"><Icon name="info" size={14} /> System info</div></div>
              <div className="panel-body" style={{ paddingTop: 6, fontSize: 12 }}>
                <ConfigRowMini label="Version" value="v1.0.4" />
                <ConfigRowMini label="Released" value="2026-05-12" />
                <ConfigRowMini label="BRD revision" value="v0.2 (2 Mar 2026)" />
                <ConfigRowMini label="Offline support" value="Read & search ✓" />
                <ConfigRowMini label="Browsers" value="Chrome, Edge, Firefox (last 2)" />
                <ConfigRowMini label="Mobile" value="Responsive (tablet / phone)" />
                <ConfigRowMini label="Languages" value="English (SA langs roadmap)" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "training" && (
        <div>
          <div className="kpi-grid">
            <div className="kpi"><div className="kpi-label">Users trained</div><div className="kpi-value">58 / 68</div><div className="kpi-foot"><span className="muted">85% coverage</span></div></div>
            <div className="kpi"><div className="kpi-label">Sessions delivered</div><div className="kpi-value">12</div><div className="kpi-foot"><span className="muted">Mar–May 2026</span></div></div>
            <div className="kpi"><div className="kpi-label">Avg satisfaction</div><div className="kpi-value">4.6/5</div><div className="kpi-foot"><span className="muted">post-session survey</span></div></div>
            <div className="kpi"><div className="kpi-label">Refresher due</div><div className="kpi-value">8</div><div className="kpi-foot"><span className="muted">users overdue</span></div></div>
          </div>

          <div className="split-2">
            <div className="panel">
              <div className="panel-head"><div className="panel-title"><Icon name="play" size={14} /> Video walkthroughs</div></div>
              <div style={{ padding: 0 }}>
                {[
                  ["Welcome & first login", "4:12", "All users"],
                  ["Running an advanced search", "6:48", "All users"],
                  ["Exporting and saving searches", "5:22", "Power User"],
                  ["Reviewing the dedup queue", "8:14", "Power User"],
                  ["Configuring scheduled reports", "7:30", "Power User"],
                  ["Approving self-registrations", "5:55", "Admin"],
                  ["Investigating POPIA SAR requests", "9:18", "Admin / Legal"]
                ].map((v, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 12, padding: "10px 16px", borderBottom: i < 6 ? "1px solid var(--border)" : "none", alignItems: "center" }}>
                    <span style={{ width: 30, height: 30, borderRadius: 6, background: "var(--olive-soft)", color: "var(--olive-2)", display: "grid", placeItems: "center" }}>
                      <Icon name="play" size={12} />
                    </span>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{v[0]}</div>
                    <span className="id-mono muted" style={{ fontSize: 11.5 }}>{v[1]}</span>
                    <span className="badge">{v[2]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><div className="panel-title"><Icon name="users" size={14} /> Upcoming live sessions</div></div>
              <div style={{ padding: 0 }}>
                {[
                  ["New user onboarding", "Tue 28 May 10:00", "MS Teams", 14],
                  ["Power BI deep-dive", "Thu 30 May 14:00", "MS Teams", 8],
                  ["POPIA refresher workshop", "Mon 2 Jun 09:30", "Hybrid", 22],
                  ["Reporting masterclass", "Fri 6 Jun 11:00", "MS Teams", 11]
                ].map((s, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{s[0]}</div>
                        <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{s[1]} · {s[2]}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="id-mono muted" style={{ fontSize: 11 }}>{s[3]} registered</span>
                        <button className="btn btn-sm btn-secondary">Enroll</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "faq" && (
        <div className="panel">
          <div className="panel-body">
            {[
              ["How are duplicate records resolved?", "The deduplication engine scores potential matches using NPO/NPC number, fuzzy name match, address, director and contact details. Matches above 70% are auto-merged; matches between 50-69% queue for Power User review. See Data Ingestion → Matching rules."],
              ["Can I export more than 10,000 records?", "Standard exports are capped at 10,000 records per the BRD (US-03). For larger datasets, contact ICT to request a full database extract — available to authorised users in SQL, CSV or Excel format."],
              ["How long are audit logs retained?", "7 years per POPIA requirements (SEC-12). Logs are tamper-evident and exportable by Administrators."],
              ["What happens when a CSO self-registers?", "Submissions enter the verification queue. CSSP staff review against DSD/CIPC records within 5 working days. Approved profiles become searchable; rejections trigger an email to the submitter with reasoning."],
              ["Is the system available offline?", "Read-only and search capabilities are available offline with the most recent cached data. Modifications, exports and pipeline runs require connectivity."],
              ["How often is the data refreshed?", "DSD pulls run weekly, CIPC monthly, SARS monthly. Self-registrations are real-time. Manual uploads happen on demand. Each pipeline shows last run timestamp on the Data Ingestion view."],
              ["Who can I contact for support?", "ICT Support at cssp-support@kagiso.org.za or +27 11 566 1900. Response SLA is 4 working hours for standard requests, 1 hour for incidents."]
            ].map((q, i) => (
              <details key={i} style={{ padding: "12px 0", borderBottom: i < 6 ? "1px solid var(--border)" : "none" }}>
                <summary style={{ cursor: "pointer", fontSize: 13.5, fontWeight: 500, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{q[0]}</span>
                  <Icon name="chevronDown" size={14} className="muted" />
                </summary>
                <div style={{ marginTop: 10, fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55, maxWidth: 700 }}>{q[1]}</div>
              </details>
            ))}
          </div>
        </div>
      )}

      {tab === "releases" && (
        <div>
          {[
            { ver: "v1.0.4", date: "2026-05-12", type: "Current", notes: ["Refined deduplication threshold tuning", "Power BI workspace connector hardened", "Added drill-down on sector dashboard"] },
            { ver: "v1.0.3", date: "2026-04-22", type: "Past", notes: ["Self-registration portal launched", "Bulk approve action for verification queue", "Print-friendly profile view"] },
            { ver: "v1.0.2", date: "2026-04-08", type: "Past", notes: ["Initial pilot release for 1,132 CSOs", "DSD weekly pipeline activated", "Executive Dashboard published"] },
            { ver: "v1.0.1", date: "2026-03-28", type: "Past", notes: ["Internal alpha — CSSP team only", "Core search & filter complete"] }
          ].map((r, i) => (
            <div key={i} className="panel" style={{ marginBottom: 10 }}>
              <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 18 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em" }}>{r.ver}</div>
                  <div className="id-mono muted" style={{ fontSize: 11, marginTop: 2 }}>{r.date}</div>
                  {r.type === "Current" && <span className="badge verified" style={{ marginTop: 6 }}>Current</span>}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {r.notes.map((n, j) => (
                    <li key={j} style={{ padding: "4px 0", fontSize: 12.5, display: "flex", gap: 8 }}>
                      <span style={{ color: "var(--primary)", marginTop: 1 }}>·</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "support" && (
        <div className="split-2">
          <div className="panel">
            <div className="panel-head"><div className="panel-title"><Icon name="mail" size={14} /> Contact channels</div></div>
            <div className="panel-body">
              <SupportRow icon="mail" label="Email support" value="cssp-support@kagiso.org.za" sub="Response within 4 working hours" />
              <SupportRow icon="phone" label="Phone" value="+27 11 566 1900" sub="Mon–Fri 08:00–16:30 SAST" />
              <SupportRow icon="external" label="Service desk" value="kagiso.servicenow.com" sub="Submit and track tickets" />
              <SupportRow icon="bell" label="Incident hotline" value="+27 11 566 1999" sub="24/7 for production incidents" />
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><div className="panel-title"><Icon name="info" size={14} /> Submit a request</div></div>
            <div className="panel-body" style={{ display: "grid", gap: 12 }}>
              <div className="field">
                <label className="field-label">Request type</label>
                <select className="select"><option>Bug report</option><option>Feature request</option><option>Data correction</option><option>Access request</option><option>General question</option></select>
              </div>
              <div className="field">
                <label className="field-label">Priority</label>
                <select className="select"><option>Normal</option><option>High</option><option>Urgent — blocking</option></select>
              </div>
              <div className="field">
                <label className="field-label">Subject</label>
                <input className="input" placeholder="Brief description…" />
              </div>
              <div className="field">
                <label className="field-label">Details</label>
                <textarea className="textarea" rows="4" placeholder="What were you trying to do? What happened? Include CSO numbers if relevant." />
              </div>
              <button className="btn btn-primary" onClick={() => toast("Request submitted — ticket #INC-04421")}>
                <Icon name="check" size={13} /> Submit ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ConfigRowMini = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 11.5 }}>
    <span className="muted">{label}</span>
    <span style={{ fontFamily: "var(--font-mono)" }}>{value}</span>
  </div>
);

const SupportRow = ({ icon, label, value, sub }) => (
  <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
    <span style={{ width: 30, height: 30, borderRadius: 6, background: "var(--primary-soft)", color: "var(--primary)", display: "grid", placeItems: "center", flexShrink: 0 }}>
      <Icon name={icon} size={14} />
    </span>
    <div>
      <div className="field-label">{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{value}</div>
      <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>{sub}</div>
    </div>
  </div>
);

window.HelpView = HelpView;
