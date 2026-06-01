// Executive Dashboard
const Dashboard = ({ user, perms, onNav }) => {
  const [provinceFilter, setProvinceFilter] = React.useState(null);
  const [dateRange, setDateRange] = React.useState("Last 90 days");

  const variant = perms?.dashboardVariant || "full";
  const role = user?.role || "Read-Only";

  const total = CSO_DATA.length;
  const verified = CSO_DATA.filter(c => c.status === "Verified").length;
  const pending = CSO_DATA.filter(c => c.status === "Pending").length;
  const flagged = CSO_DATA.filter(c => c.status === "Flagged").length;
  const completeness = Math.round(CSO_DATA.reduce((a, c) => a + c.completeness, 0) / total);

  const topSectors = SECTOR_COUNTS.slice(0, 8);
  const sectorMax = Math.max(...topSectors.map(s => s.count));

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();
  const firstName = (user?.email || "").split("@")[0].split(".")[0];
  const firstNameCap = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  // Tailored subtitles per role
  const subtitle = variant === "exec"
    ? `Read-only executive summary across ${total.toLocaleString()} CSO records. Last refresh 2 minutes ago.`
    : variant === "standard"
    ? `Standard view — search, browse profiles, and run basic reports across ${total.toLocaleString()} CSO records.`
    : `Live view of the CSO Database — ${total.toLocaleString()} records across DSD, CIPC, SARS & Kagiso pipelines. Last refresh 2 minutes ago.`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting}, {firstNameCap}</h1>
          <p className="page-sub">{subtitle}</p>
        </div>
        <div className="page-header-actions">
          <select className="select" value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ width: 160 }}>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Year to date</option>
            <option>All time</option>
          </select>
          {perms?.canExport && (
            <button className="btn btn-secondary">
              <Icon name="download" size={13} />
              Export PDF
            </button>
          )}
          {perms?.canBuildCustomReports && (
            <button className="btn btn-primary">
              <Icon name="external" size={13} />
              Open in Power BI
            </button>
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Total CSOs <Icon name="database" size={13} /></div>
          <div className="kpi-value">{total.toLocaleString()}</div>
          <div className="kpi-foot">
            <span className="kpi-delta up">+412</span>
            <span className="muted">this week from DSD pipeline</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Verified <Icon name="check" size={13} /></div>
          <div className="kpi-value">{verified.toLocaleString()}</div>
          <div className="kpi-foot">
            <span className="kpi-delta up">{Math.round(verified / total * 100)}%</span>
            <span className="muted">of database, target ≥85%</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Data completeness <Icon name="target" size={13} /></div>
          <div className="kpi-value">{completeness}%</div>
          <div className="kpi-foot">
            <span className="kpi-target">Target ≥85%</span>
            <span className="kpi-delta up">+2.4 pts MoM</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Active users (30d) <Icon name="users" size={13} /></div>
          <div className="kpi-value">68</div>
          <div className="kpi-foot">
            <span className="kpi-delta up">+11</span>
            <span className="muted">target 50+</span>
          </div>
        </div>
      </div>

      {/* Main viz row */}
      <div className="split-23" style={{ marginBottom: 16 }}>
        {/* Province map */}
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title"><Icon name="map" size={15} /> CSO distribution by province</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                {provinceFilter ? `Showing: ${provinceFilter}` : "Click a province to drill down"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className={`btn btn-sm ${!provinceFilter ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setProvinceFilter(null)}>All</button>
              <button className="btn btn-sm btn-ghost" onClick={() => onNav('search')}>
                <Icon name="external" size={11} />
                View list
              </button>
            </div>
          </div>
          <div className="panel-body" style={{ padding: 16, paddingTop: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, alignItems: "center" }}>
              <SAMap counts={PROVINCE_COUNTS} activeProvince={provinceFilter} onSelect={setProvinceFilter} />
              <div>
                {PROVINCE_COUNTS.map(p => (
                  <div key={p.name} className="bar-row" onClick={() => setProvinceFilter(p.name)} style={{ cursor: "pointer" }}>
                    <div className="bar-label" style={{ flex: "0 0 110px", fontSize: 11.5 }}>{p.name}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(p.count / PROVINCE_COUNTS[0].count) * 100}%`, background: provinceFilter === p.name ? "var(--accent)" : "var(--primary)" }} />
                    </div>
                    <div className="bar-val">{p.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status / quality */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="pie" size={15} /> Verification status</div>
            <span className="panel-sub">live</span>
          </div>
          <div className="panel-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <PieChart
              data={[
                { name: "Verified", count: verified },
                { name: "Pending", count: pending },
                { name: "Flagged", count: flagged }
              ]}
              colors={["#65735C", "#D5A62A", "#A8331F"]}
              size={170}
            />
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
              <LegendRow color="#65735C" label="Verified" count={verified} total={total} />
              <LegendRow color="#D5A62A" label="Pending verification" count={pending} total={total} />
              <LegendRow color="#A8331F" label="Flagged for review" count={flagged} total={total} />
            </div>
          </div>
        </div>
      </div>

      {/* Sector + Trend */}
      <div className="split-2" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="layers" size={15} /> Top sectors</div>
            <div className="panel-sub">{SECTORS.length} sectors</div>
          </div>
          <div className="panel-body">
            {topSectors.map(s => (
              <div key={s.name} className="bar-row">
                <div className="bar-label" style={{ flex: "0 0 170px" }}>{s.name}</div>
                <div className="bar-track">
                  <div className="bar-fill accent" style={{ width: `${(s.count / sectorMax) * 100}%` }} />
                </div>
                <div className="bar-val">{s.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="activity" size={15} /> Registration trend (by year)</div>
            <div className="panel-sub">{REG_TREND.length} years</div>
          </div>
          <div className="panel-body" style={{ paddingTop: 8 }}>
            <LineChart data={REG_TREND} height={220} />
          </div>
        </div>
      </div>

      {/* Activity + alerts — only for users with admin/operational visibility */}
      {variant === "full" && (
      <div className="split-23">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="clock" size={15} /> Recent activity</div>
            <button className="btn btn-sm btn-ghost" onClick={() => onNav('admin')}>
              View audit log
              <Icon name="arrowRight" size={11} />
            </button>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {AUDIT_LOG.slice(0, 6).map(e => (
              <div key={e.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, padding: "10px 16px", borderBottom: "1px solid var(--border)", alignItems: "center", fontSize: 12.5 }}>
                <span className={`badge ${e.action === 'EXPORT' ? 'accent' : e.action === 'INGEST' ? 'info' : e.action === 'CREATE' ? 'verified' : e.action === 'MERGE' ? 'flagged' : ''}`}>
                  {e.action}
                </span>
                <div>
                  <div>{e.target}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{e.user} · {e.role}</div>
                </div>
                <div className="id-mono muted" style={{ fontSize: 10.5 }}>{e.ts.split(" ")[1]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="bell" size={15} /> Action queue</div>
            <span className="badge accent">3</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <AlertItem icon="warn" tone="flagged" title="2 duplicate clusters need review" desc="Probable matches found across DSD ↔ SARS" cta="Review →" onClick={() => onNav('quality')} />
            <AlertItem icon="upload" tone="info" title="SARS schema drift detected" desc="Column 'tax_status' was renamed in last pull" cta="View pipeline →" onClick={() => onNav('ingestion')} />
            <AlertItem icon="user" tone="pending" title="47 self-registrations pending" desc="Awaiting CSSP staff verification" cta="Open queue →" onClick={() => onNav('search')} />
            <AlertItem icon="check" tone="verified" title="Q1 data quality report ready" desc="Auto-generated, awaiting your approval" cta="Open report →" onClick={() => onNav('reports')} />
          </div>
        </div>
      </div>
      )}

      {/* Welcome panel for Read-Only / Standard with no action queue */}
      {variant !== "full" && (
        <div className="panel" style={{ padding: 22, background: "var(--panel-2)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center" }}>
            <img src="assets/kagiso-bird.png" alt="" style={{ height: 56, opacity: 0.9 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                {variant === "exec" ? "Read-only access" : "Standard CSSP staff access"}
              </div>
              <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, maxWidth: 640 }}>
                {variant === "exec"
                  ? "You can browse search results and view organisation profiles. Exports, edits and admin actions are reserved for Power Users and Administrators. Need broader access? Contact ICT."
                  : "You can search, view profiles and run basic reports (up to 1,000 records per export). Approving registrations, merging duplicates and managing pipelines require Power User role."}
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => onNav('help')}>
              <Icon name="book" size={13} />
              View role guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const LegendRow = ({ color, label, count, total }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
    <span style={{ width: 9, height: 9, borderRadius: 2, background: color, flexShrink: 0 }} />
    <span style={{ flex: 1 }}>{label}</span>
    <span className="id-mono" style={{ fontSize: 11.5 }}>{count.toLocaleString()}</span>
    <span className="muted" style={{ fontSize: 11, fontFamily: "var(--font-mono)", width: 40, textAlign: "right" }}>{(count / total * 100).toFixed(1)}%</span>
  </div>
);

const AlertItem = ({ icon, tone, title, desc, cta, onClick }) => (
  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 11, padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
    <span className={`badge ${tone}`} style={{ width: 24, height: 24, padding: 0, justifyContent: "center", borderRadius: 5 }}>
      <Icon name={icon} size={12} />
    </span>
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{title}</div>
      <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>{desc}</div>
      <div className="faux-link" style={{ fontSize: 11.5, marginTop: 4 }} onClick={onClick}>{cta}</div>
    </div>
  </div>
);

window.Dashboard = Dashboard;
