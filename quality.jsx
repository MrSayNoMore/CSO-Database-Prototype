// Data Quality dashboard
const QualityView = ({ toast }) => {
  const completenessAvg = Math.round(CSO_DATA.reduce((a, c) => a + c.completeness, 0) / CSO_DATA.length);
  const verified = CSO_DATA.filter(c => c.status === "Verified").length;
  const lowQ = CSO_DATA.filter(c => c.completeness < 65);
  const flagged = CSO_DATA.filter(c => c.status === "Flagged");

  // missing field analysis
  const missingByField = [
    { field: "Postal address", missing: 89, pct: 21 },
    { field: "Director name", missing: 42, pct: 10 },
    { field: "Email", missing: 38, pct: 9 },
    { field: "Date registered", missing: 28, pct: 7 },
    { field: "District", missing: 22, pct: 5 },
    { field: "Postal code", missing: 19, pct: 4 },
    { field: "Telephone", missing: 14, pct: 3 },
    { field: "Sector", missing: 8, pct: 2 }
  ];

  const completenessBuckets = [
    { range: "90-100%", count: CSO_DATA.filter(c => c.completeness >= 90).length, color: "var(--primary)" },
    { range: "75-89%", count: CSO_DATA.filter(c => c.completeness >= 75 && c.completeness < 90).length, color: "#3F8770" },
    { range: "60-74%", count: CSO_DATA.filter(c => c.completeness >= 60 && c.completeness < 75).length, color: "var(--warn)" },
    { range: "<60%", count: CSO_DATA.filter(c => c.completeness < 60).length, color: "var(--danger)" }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Quality</h1>
          <p className="page-sub">Monitor completeness, accuracy and consistency across all sources. Target completeness ≥ 85%. Issues are triaged into actionable queues below.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="download" size={13} /> Quality report (PDF)</button>
          <button className="btn btn-primary"><Icon name="bolt" size={13} /> Run validation now</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Avg completeness <Icon name="target" size={13} /></div>
          <div className="kpi-value" style={{ color: completenessAvg >= 85 ? "var(--primary)" : "var(--warn)" }}>{completenessAvg}%</div>
          <div className="kpi-foot"><span className="kpi-target">target ≥85%</span> <span className="kpi-delta up">+2.4 MoM</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Verified records <Icon name="check" size={13} /></div>
          <div className="kpi-value">{Math.round(verified / CSO_DATA.length * 100)}%</div>
          <div className="kpi-foot"><span className="muted">{verified.toLocaleString()} of {CSO_DATA.length.toLocaleString()}</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Duplicate clusters <Icon name="git" size={13} /></div>
          <div className="kpi-value">3</div>
          <div className="kpi-foot"><span className="muted">awaiting merge decision</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Validation errors <Icon name="warn" size={13} /></div>
          <div className="kpi-value">{flagged.length + 14}</div>
          <div className="kpi-foot"><span className="muted">{flagged.length} blocking · 14 warnings</span></div>
        </div>
      </div>

      <div className="split-2" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="pie" size={14} /> Completeness distribution</div>
          </div>
          <div className="panel-body">
            {completenessBuckets.map(b => {
              const pct = (b.count / CSO_DATA.length) * 100;
              return (
                <div key={b.range} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500 }}>{b.range}</span>
                    <span className="id-mono muted" style={{ fontSize: 11.5 }}>{b.count} records · {pct.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 9, background: "var(--bg-2)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: b.color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 16, padding: 12, background: "var(--bg-2)", borderRadius: 6, fontSize: 12, color: "var(--text-2)" }}>
              <strong>{Math.round(((completenessBuckets[0].count + completenessBuckets[1].count) / CSO_DATA.length) * 100)}%</strong> of records meet the ≥75% completeness baseline. To reach the 85% target, prioritise the {lowQ.length} records below 65%.
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="warn" size={14} /> Top missing fields</div>
            <span className="panel-sub">{CSO_DATA.length} records scanned</span>
          </div>
          <div className="panel-body">
            {missingByField.map(m => (
              <div key={m.field} className="bar-row">
                <div className="bar-label" style={{ flex: "0 0 130px" }}>{m.field}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${m.pct * 4}%`, background: m.pct > 15 ? "var(--danger)" : m.pct > 7 ? "var(--warn)" : "var(--primary)" }} />
                </div>
                <div className="bar-val">{m.missing}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DQ dimensions */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div className="panel-title"><Icon name="layers" size={14} /> Data quality dimensions</div>
          <span className="panel-sub">per BRD § Data Quality</span>
        </div>
        <div className="panel-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            <DqDimension name="Completeness" value={completenessAvg} target={85} unit="%" />
            <DqDimension name="Accuracy" value={96} target={100} unit="%" />
            <DqDimension name="Consistency" value={99.2} target={99} unit="%" />
            <DqDimension name="Timeliness" value={"3w"} target={"≤13w"} unit="" small="Quarterly max refresh" />
            <DqDimension name="Uniqueness" value={99.3} target={100} unit="%" warn />
          </div>
        </div>
      </div>

      {/* Low quality records queue */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div className="panel-title"><Icon name="flag" size={14} /> Records needing attention</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-sm btn-secondary">Filter: All</button>
            <button className="btn btn-sm btn-ghost">Export queue</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr><th>CSO No.</th><th>Organisation</th><th>Province</th><th>Completeness</th><th>Issues</th><th>Last update</th><th></th></tr>
          </thead>
          <tbody>
            {lowQ.slice(0, 8).map(c => (
              <tr key={c.id}>
                <td className="id-mono">{c.cso_number}</td>
                <td><strong>{c.name}</strong></td>
                <td>{c.province}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 5, background: "var(--bg-2)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${c.completeness}%`, height: "100%", background: "var(--danger)" }} />
                    </div>
                    <span className="id-mono">{c.completeness}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <span className="badge flagged">Missing postal</span>
                    {c.completeness < 55 && <span className="badge flagged">Missing email</span>}
                    {c.completeness < 50 && <span className="badge flagged">No director</span>}
                  </div>
                </td>
                <td className="id-mono muted">{c.lastUpdated}</td>
                <td><button className="btn btn-sm btn-secondary">Fix →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Validation rules */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title"><Icon name="shield" size={14} /> Active validation rules</div>
          <button className="btn btn-sm btn-secondary"><Icon name="plus" size={11} /> Add rule</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Rule</th><th>Severity</th><th>Triggered (30d)</th><th>Auto-fix</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[
              ["NPO number must be unique", "Blocking", 7, "No", true],
              ["Email must match RFC 5322 format", "Warning", 23, "Strip whitespace", true],
              ["Phone must be 10 digits SA format", "Warning", 41, "Normalise +27", true],
              ["Province must be from 9 SA provinces", "Blocking", 0, "Fuzzy match", true],
              ["Postal code must be 4 digits", "Warning", 18, "Pad zeros", true],
              ["Date registered cannot be in future", "Blocking", 2, "No", true],
              ["Sector must map to taxonomy", "Warning", 12, "Suggest closest", true],
              ["Required fields populated", "Warning", 89, "No", true]
            ].map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td>
                <td><span className={`badge ${r[1] === "Blocking" ? "flagged" : "pending"}`}>{r[1]}</span></td>
                <td className="id-mono">{r[2]}</td>
                <td>{r[3]}</td>
                <td><span className="badge verified"><span className="dot"></span> Enabled</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DqDimension = ({ name, value, target, unit, warn, small }) => {
  const pct = typeof value === "number" ? value : 90;
  return (
    <div style={{ padding: 14, border: "1px solid var(--border)", borderRadius: 8, background: "var(--panel-2)" }}>
      <div className="field-label">{name}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: warn ? "var(--warn)" : "var(--text)" }}>{value}{unit}</span>
      </div>
      <div className="muted" style={{ fontSize: 11, marginTop: 4, fontFamily: "var(--font-mono)" }}>{small || `target ${target}${unit}`}</div>
      {typeof value === "number" && (
        <div style={{ height: 3, background: "var(--bg-2)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
          <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: warn ? "var(--warn)" : "var(--primary)" }} />
        </div>
      )}
    </div>
  );
};

window.QualityView = QualityView;
