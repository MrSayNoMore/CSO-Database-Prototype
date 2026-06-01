// Data Ingestion / Pipelines view
const IngestionView = ({ toast, perms = {} }) => {
  const [running, setRunning] = React.useState(null);
  const [showUpload, setShowUpload] = React.useState(false);
  const canRun = perms.canRunPipelines === true;

  const runPipeline = (id) => {
    setRunning(id);
    setTimeout(() => {
      setRunning(null);
      toast(`Pipeline "${id}" completed: 142 new, 28 updated, 3 flagged`);
    }, 2200);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Ingestion</h1>
          <p className="page-sub">Automated pipelines from DSD, CIPC, SARS — plus Kagiso manual uploads and the CSO self-registration portal. All records flow through the deduplication and matching engine.</p>
        </div>
        <div className="page-header-actions">
          {canRun && (
            <button className="btn btn-secondary" onClick={() => setShowUpload(true)}>
              <Icon name="upload" size={13} /> Manual upload
            </button>
          )}
          {canRun ? (
            <button className="btn btn-primary" onClick={() => toast("All pipelines refreshed")}>
              <Icon name="refresh" size={13} /> Run all
            </button>
          ) : (
            <span className="badge"><Icon name="lock" size={10} /> Admin-only actions hidden</span>
          )}
        </div>
      </div>

      {/* Pipeline stats */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Total ingested <Icon name="database" size={13} /></div>
          <div className="kpi-value">{PIPELINES.reduce((a, p) => a + p.totalImported, 0).toLocaleString()}</div>
          <div className="kpi-foot"><span className="muted">across {PIPELINES.length} sources</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">This week Δ <Icon name="bolt" size={13} /></div>
          <div className="kpi-value">+{PIPELINES.reduce((a, p) => a + p.lastDelta, 0).toLocaleString()}</div>
          <div className="kpi-foot"><span className="kpi-delta up">+4.2% vs last week</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Healthy pipelines <Icon name="check" size={13} /></div>
          <div className="kpi-value">{PIPELINES.filter(p => p.status === "Healthy").length} / {PIPELINES.length}</div>
          <div className="kpi-foot"><span className="muted">1 warning — SARS schema drift</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Dedup match rate <Icon name="git" size={13} /></div>
          <div className="kpi-value">94.8%</div>
          <div className="kpi-foot"><span className="muted">avg over last 30 ingest jobs</span></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div className="panel-title"><Icon name="git" size={14} /> Active pipelines</div>
          <span className="panel-sub">auto-refresh 60s</span>
        </div>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 110px 110px 110px 90px", gap: 14, padding: "8px 16px", background: "var(--panel-2)", borderBottom: "1px solid var(--border)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            <span>Source</span><span>Status</span><span>Cadence</span><span>Last run</span><span>Total imported</span><span></span>
          </div>
          {PIPELINES.map(p => (
            <div key={p.id} className="pipeline-row">
              <div className="pipeline-name">
                <span className="n">{p.name}</span>
                <span className="s">{p.source}</span>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`dot ${p.status === "Healthy" ? "green" : "amber"}`}></span>
                  <span className="status-pill">{p.status}</span>
                  {running === p.id && <span className="muted" style={{ fontSize: 11 }}>· running…</span>}
                </div>
                {p.note && <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>⚠ {p.note}</div>}
                {running === p.id && (
                  <div className="progress" style={{ marginTop: 6 }}>
                    <div style={{ width: "60%", animation: "none" }} />
                  </div>
                )}
              </div>
              <span className="id-mono muted" style={{ fontSize: 11.5 }}>{p.cadence}</span>
              <div style={{ fontSize: 11.5 }}>
                <div className="id-mono">{p.lastRun.split(" ")[0]}</div>
                <div className="muted">{p.lastRun.split(" ")[1] || ""}</div>
              </div>
              <div style={{ fontSize: 12 }}>
                <div style={{ fontWeight: 500 }}>{p.totalImported.toLocaleString()}</div>
                <div className="muted" style={{ fontSize: 11 }}>+{p.lastDelta} last run</div>
              </div>
              <button className="btn btn-sm btn-secondary" disabled={running === p.id || !canRun} onClick={() => canRun && runPipeline(p.id)}>
                <Icon name={canRun ? "play" : "lock"} size={10} /> {canRun ? "Run" : "View"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Merge & dedup */}
      <div className="split-2" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="git" size={14} /> Deduplication queue</div>
            <span className="badge flagged">3 clusters</span>
          </div>
          <div style={{ padding: 0 }}>
            {[
              { a: "Ubuntu Care Centre", b: "Ubuntu Care Trust", conf: 92, reason: "Same NPO number, name variant" },
              { a: "Tsogang Community Project", b: "Tsogang Community Forum", conf: 78, reason: "Similar address, different reg #" },
              { a: "Hope Foundation (Soweto)", b: "Hope Foundation NPO", conf: 84, reason: "Identical director, overlapping contacts" }
            ].map((m, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{m.a}</div>
                  <span className="id-mono" style={{ fontSize: 10.5, padding: "2px 6px", background: "var(--accent-soft)", color: "var(--accent)", borderRadius: 3 }}>↔ {m.conf}%</span>
                  <div style={{ fontSize: 12.5, fontWeight: 500, textAlign: "right" }}>{m.b}</div>
                </div>
                <div className="muted" style={{ fontSize: 11.5, marginBottom: 8 }}>{m.reason}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-sm btn-primary"><Icon name="check" size={11} /> Merge</button>
                  <button className="btn btn-sm btn-secondary">Keep separate</button>
                  <button className="btn btn-sm btn-ghost">Investigate</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="panel-title"><Icon name="sliders" size={14} /> Matching rules</div>
            <span className="panel-sub">configurable</span>
          </div>
          <div className="panel-body" style={{ paddingTop: 8 }}>
            {[
              { name: "NPO/NPC number exact match", weight: 100, on: true },
              { name: "Organisation name (fuzzy ≥85%)", weight: 70, on: true },
              { name: "Physical address (normalised)", weight: 55, on: true },
              { name: "Director name + DOB", weight: 60, on: true },
              { name: "Contact email or phone", weight: 40, on: true },
              { name: "Postal code + sector", weight: 25, on: false }
            ].map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 40px", gap: 12, padding: "10px 0", borderBottom: i < 5 ? "1px solid var(--border)" : "none", alignItems: "center", fontSize: 12.5 }}>
                <div>
                  <div style={{ fontWeight: r.on ? 500 : 400, opacity: r.on ? 1 : 0.6 }}>{r.name}</div>
                </div>
                <span className="id-mono muted" style={{ fontSize: 11 }}>weight {r.weight}</span>
                <span style={{ width: 30, height: 18, borderRadius: 9, background: r.on ? "var(--primary)" : "var(--border-strong)", position: "relative", cursor: "pointer" }}>
                  <span style={{ position: "absolute", top: 2, left: r.on ? 14 : 2, width: 14, height: 14, borderRadius: "50%", background: "white", transition: "left 0.15s" }}/>
                </span>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: 12, background: "var(--bg-2)", borderRadius: 6, fontSize: 11.5, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Threshold ≥ 70 → auto-merge<br />
              Threshold 50–69 → queue for review<br />
              Threshold &lt; 50 → keep separate
            </div>
          </div>
        </div>
      </div>

      {/* Recent ingestion runs */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title"><Icon name="clock" size={14} /> Recent ingestion runs</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Run ID</th><th>Pipeline</th><th>Started</th><th>Duration</th>
              <th>New</th><th>Updated</th><th>Flagged</th><th>Rejected</th><th>Result</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["RUN-08821", "DSD NPO", "2026-05-25 13:55", "4m 12s", 412, 88, 14, 2, "Success"],
              ["RUN-08820", "Self-Reg", "2026-05-25 12:30", "—", 1, 0, 0, 0, "Success"],
              ["RUN-08819", "CIPC NPC", "2026-05-25 08:45", "11m 38s", 1842, 240, 18, 7, "Success"],
              ["RUN-08818", "Kagiso Manual", "2026-05-24 11:30", "0m 22s", 18, 2, 0, 0, "Success"],
              ["RUN-08817", "SARS PBO", "2026-05-20 04:12", "—", 0, 0, 0, 24, "Warning"],
              ["RUN-08816", "DSD NPO", "2026-05-18 13:55", "3m 50s", 388, 92, 11, 4, "Success"]
            ].map((r, i) => (
              <tr key={i}>
                <td className="id-mono">{r[0]}</td>
                <td>{r[1]}</td>
                <td className="id-mono muted">{r[2]}</td>
                <td className="id-mono">{r[3]}</td>
                <td className="id-mono">{r[4]}</td>
                <td className="id-mono muted">{r[5]}</td>
                <td className="id-mono" style={{ color: r[6] > 0 ? "var(--warn)" : "" }}>{r[6]}</td>
                <td className="id-mono" style={{ color: r[7] > 0 ? "var(--danger)" : "" }}>{r[7]}</td>
                <td><span className={`badge ${r[8] === "Success" ? "verified" : "pending"}`}>{r[8]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} toast={toast} />}
    </div>
  );
};

const UploadModal = ({ onClose, toast }) => {
  const [step, setStep] = React.useState(1);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Manual data upload</div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <>
              <div className="field-label" style={{ marginBottom: 8 }}>Step 1 of 3 · Source file</div>
              <div className="upload-zone">
                <Icon name="upload" size={24} />
                <div style={{ marginTop: 8 }}><strong>Drop your CSV or Excel file here</strong></div>
                <div style={{ fontSize: 11.5, marginTop: 4 }}>Max 10MB · .csv, .xlsx · Template available</div>
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: "var(--muted)" }}>
                Or <span className="faux-link">download CSV template</span> with the required column structure.
              </div>
              <div className="field" style={{ marginTop: 14 }}>
                <label className="field-label">Source label</label>
                <input className="input" placeholder="e.g. Provincial DSD outreach Q1 2026" defaultValue="Provincial DSD outreach Q1 2026" />
              </div>
            </>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onClose(); toast("File queued — 142 valid records, 8 flagged for review"); }}>
            Validate & queue <Icon name="arrowRight" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

window.IngestionView = IngestionView;
