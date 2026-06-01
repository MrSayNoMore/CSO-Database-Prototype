// CSO Profile detail view
const ProfileView = ({ cso, onBack, role, perms = {}, toast }) => {
  const [tab, setTab] = React.useState("profile");
  const canEdit = perms.canEdit === true;
  const canExport = perms.canExport === true || perms.canExport === "limited";

  // related CSOs (same sector + province)
  const related = CSO_DATA.filter(c => c.id !== cso.id && (c.sector === cso.sector || c.province === cso.province)).slice(0, 5);

  return (
    <div>
      <div className="page-header" style={{ alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={onBack}>
            <Icon name="arrowLeft" size={13} /> Back to search
          </button>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            <span className="kbd" style={{ marginRight: 4 }}>esc</span>
          </span>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => toast("Print preview opened")}>
            <Icon name="print" size={13} /> Print
          </button>
          {canExport && (
            <button className="btn btn-secondary" onClick={() => toast("Profile exported")}>
              <Icon name="download" size={13} /> Export
            </button>
          )}
          {canEdit && (
            <button className="btn btn-primary" onClick={() => toast("Edit mode (read-only in demo)")}>
              <Icon name="edit" size={13} /> Edit profile
            </button>
          )}
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="profile-hero">
          <div className="profile-mark">
            {cso.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
          </div>
          <div className="profile-meta">
            <div className="name">{cso.name}</div>
            <div className="sub">
              <span className="id-mono">{cso.cso_number}</span>
              <span>·</span>
              <span className="badge">{cso.type}</span>
              <span>·</span>
              <span>{cso.sector}</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <span className={`badge ${cso.status === "Verified" ? "verified" : cso.status === "Pending" ? "pending" : "flagged"}`}>
                <span className="dot"></span>
                {cso.status}
              </span>
              {cso.npoRegistered && <span className="badge info">NPO ✓</span>}
              {cso.sarsExempt && <span className="badge accent">SARS PBO ✓</span>}
              {cso.sources.map(s => <span key={s} className="badge">{s}</span>)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <Donut value={cso.completeness} size={84} stroke={7} label="completeness" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, padding: "12px 22px", borderBottom: "1px solid var(--border)", background: "var(--panel-2)", fontSize: 12.5 }}>
          <div><span className="muted">Beneficiaries / yr</span> <strong style={{ marginLeft: 6 }}>{cso.beneficiaries.toLocaleString()}</strong></div>
          <div><span className="muted">Staff & volunteers</span> <strong style={{ marginLeft: 6 }}>{cso.staff}</strong></div>
          <div><span className="muted">Funding model</span> <strong style={{ marginLeft: 6 }}>{cso.funding}</strong></div>
          <div><span className="muted">Last updated</span> <strong style={{ marginLeft: 6 }}>{cso.lastUpdated}</strong></div>
        </div>

        <div className="tabs" style={{ padding: "0 22px", margin: 0 }}>
          {[
            ["profile", "Profile"],
            ["service", "Service & impact"],
            ["docs", "Documents"],
            ["lineage", "Data lineage"],
            ["history", "Change history"]
          ].map(([id, l]) => (
            <div key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{l}</div>
          ))}
        </div>

        {tab === "profile" && (
          <div className="detail-grid">
            <Detail label="Organisation name" value={cso.name} />
            <Detail label="Organisation type" value={cso.type} />
            <Detail label="CSO / NPO number" value={cso.cso_number} mono />
            <Detail label="Date registered" value={cso.dateReg} mono />
            <Detail label="Primary sector" value={cso.sector} />
            <Detail label="Director / Lead person" value={cso.director} />
            <Detail label="Primary contact" value={cso.contact} />
            <Detail label="Email" value={cso.email} />
            <Detail label="Telephone" value={cso.phone} mono />
            <Detail label="NPO registered (DSD)" value={cso.npoRegistered ? "Yes" : "No"} />
            <Detail label="Physical address" value={cso.address} />
            <Detail label="Postal address" value={cso.postalAddress || "Same as physical"} />
            <Detail label="City / town" value={cso.city} />
            <Detail label="District municipality" value={cso.district} />
            <Detail label="Province" value={cso.province} />
            <Detail label="Postal code" value={cso.postalCode} mono />
          </div>
        )}

        {tab === "service" && (
          <div style={{ padding: 22 }}>
            <div className="field-label" style={{ marginBottom: 6 }}>Primary service provided</div>
            <p style={{ fontSize: 14, lineHeight: 1.55, margin: "0 0 22px", maxWidth: 720 }}>{cso.service}</p>

            <div className="split-3" style={{ gap: 14 }}>
              <StatBlock label="Beneficiaries / year" value={cso.beneficiaries.toLocaleString()} sub="self-reported" />
              <StatBlock label="Staff & volunteers" value={cso.staff} sub={`${Math.round(cso.staff * 0.4)} paid · ${cso.staff - Math.round(cso.staff * 0.4)} volunteers`} />
              <StatBlock label="Funding model" value={cso.funding} sub="reviewed quarterly" />
            </div>

            <div className="field-label" style={{ marginTop: 24, marginBottom: 8 }}>Beneficiary trend (last 12 months — illustrative)</div>
            <div className="panel" style={{ padding: 14 }}>
              <Sparkbar data={[12, 18, 22, 19, 25, 31, 28, 34, 30, 38, 42, 45]} height={48} />
            </div>
          </div>
        )}

        {tab === "docs" && (
          <div style={{ padding: 22 }}>
            <DocItem name="NPO Certificate" issued="2018-03-14" status="Verified" size="412 KB" sharePoint="/sites/cssp/docs/npo-cert.pdf" />
            <DocItem name="SARS PBO Approval" issued="2019-07-02" status="Verified" size="208 KB" sharePoint="/sites/cssp/docs/sars-pbo.pdf" />
            <DocItem name="Audited Financial Statements 2024" issued="2024-09-12" status="Verified" size="1.2 MB" sharePoint="/sites/cssp/docs/afs-2024.pdf" />
            <DocItem name="Annual Narrative Report 2024" issued="2024-09-12" status="Pending review" size="3.4 MB" sharePoint="/sites/cssp/docs/narrative-2024.pdf" />
            <DocItem name="Board Constitution" issued="2018-03-14" status="Verified" size="156 KB" sharePoint="/sites/cssp/docs/constitution.pdf" />

            <div style={{ marginTop: 16, padding: 14, background: "var(--info-soft)", borderRadius: 6, fontSize: 12.5, color: "var(--info)", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon name="info" size={14} />
              <div>Documents are stored in <strong>SharePoint</strong> at <span className="id-mono">/sites/cssp/docs/{cso.cso_number}</span>. Access governed by Azure AD role membership.</div>
            </div>
          </div>
        )}

        {tab === "lineage" && (
          <div style={{ padding: 22 }}>
            <div className="field-label" style={{ marginBottom: 10 }}>Source records merged into this profile</div>
            {cso.sources.map((src, i) => (
              <div key={src} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14, padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 6, marginBottom: 8, alignItems: "center" }}>
                <span className="badge info">{src}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>
                    {src === "DSD" && `DSD NPO Registry — record ${String(cso.id + 100000).padStart(7, '0')}`}
                    {src === "CIPC" && `CIPC NPC Register — ${cso.cso_number.replace('-NPO', '/NPC')}`}
                    {src === "SARS" && `SARS PBO ref ${String(cso.id + 9000).padStart(7, '0')}`}
                    {src === "Kagiso" && `Manual upload by L. Mothapo`}
                    {src === "Self-Reg" && `Self-registered via public portal`}
                  </div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                    Last sync: {i === 0 ? "2026-05-25 13:55" : i === 1 ? "2026-05-25 08:45" : "2026-05-20 04:12"}
                  </div>
                </div>
                <span className="badge verified">Matched</span>
                <button className="btn btn-sm btn-ghost"><Icon name="eye" size={11} /> View raw</button>
              </div>
            ))}

            <div className="field-label" style={{ marginTop: 24, marginBottom: 10 }}>Field-level provenance (sample)</div>
            <table className="table" style={{ border: "1px solid var(--border)", borderRadius: 6 }}>
              <thead>
                <tr><th>Field</th><th>Value</th><th>Authoritative source</th><th>Confidence</th></tr>
              </thead>
              <tbody>
                <tr><td>Organisation name</td><td>{cso.name}</td><td><span className="badge info">DSD</span></td><td className="id-mono">98%</td></tr>
                <tr><td>NPO number</td><td className="id-mono">{cso.cso_number}</td><td><span className="badge info">DSD</span></td><td className="id-mono">100%</td></tr>
                <tr><td>Physical address</td><td>{cso.city}, {cso.province}</td><td><span className="badge info">CIPC</span></td><td className="id-mono">82%</td></tr>
                <tr><td>Tax exemption</td><td>{cso.sarsExempt ? "PBO approved" : "Not exempt"}</td><td><span className="badge info">SARS</span></td><td className="id-mono">100%</td></tr>
                <tr><td>Director</td><td>{cso.director}</td><td><span className="badge info">CIPC</span></td><td className="id-mono">94%</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {tab === "history" && (
          <div style={{ padding: 22 }}>
            <div className="field-label" style={{ marginBottom: 10 }}>Change history (7-year retention per POPIA)</div>
            <div style={{ borderLeft: "2px solid var(--border)", paddingLeft: 14, marginLeft: 6 }}>
              {[
                { ts: "2026-05-12 14:08", user: "T. Nkosi", action: "Updated contact email" },
                { ts: "2026-04-22 11:30", user: "System", action: "DSD pipeline sync — no changes" },
                { ts: "2026-03-08 09:15", user: "L. Mothapo", action: "Merged duplicate record (ID 388)" },
                { ts: "2026-02-14 16:42", user: "Self-Reg", action: "Profile verified by CSSP staff" },
                { ts: "2026-01-30 10:22", user: "Self-Reg", action: "Initial registration submitted" }
              ].map((h, i) => (
                <div key={i} style={{ position: "relative", paddingBottom: 16, fontSize: 12.5 }}>
                  <div style={{ position: "absolute", left: -20, top: 4, width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", border: "2px solid var(--bg)" }} />
                  <div className="id-mono muted" style={{ fontSize: 11 }}>{h.ts}</div>
                  <div style={{ marginTop: 2 }}>{h.action}</div>
                  <div className="muted" style={{ fontSize: 11 }}>by {h.user}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title"><Icon name="git" size={14} /> Related organisations</div>
          <span className="panel-sub">same sector or province</span>
        </div>
        <div style={{ padding: 0 }}>
          {related.map(r => (
            <div key={r.id} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 200px 100px 90px", gap: 14, alignItems: "center", fontSize: 12.5, cursor: "pointer" }} onClick={() => { window.scrollTo(0, 0); window.__navProfile && window.__navProfile(r); }}>
              <div>
                <div style={{ fontWeight: 500 }}>{r.name}</div>
                <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{r.cso_number}</div>
              </div>
              <span className="badge">{r.sector}</span>
              <span>{r.province}</span>
              <span className={`badge ${r.status === "Verified" ? "verified" : "pending"}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value, mono }) => (
  <div className="detail">
    <div className="detail-label">{label}</div>
    <div className="detail-value" style={mono ? { fontFamily: "var(--font-mono)", fontSize: 12.5 } : null}>{value}</div>
  </div>
);

const StatBlock = ({ label, value, sub }) => (
  <div style={{ padding: 14, border: "1px solid var(--border)", borderRadius: 6 }}>
    <div className="field-label">{label}</div>
    <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", marginTop: 4 }}>{value}</div>
    <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{sub}</div>
  </div>
);

const DocItem = ({ name, issued, status, size, sharePoint }) => (
  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto auto", gap: 12, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, marginBottom: 6, alignItems: "center" }}>
    <Icon name="file" size={16} className="muted" />
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{name}</div>
      <div className="muted" style={{ fontSize: 11, fontFamily: "var(--font-mono)", marginTop: 1 }}>{sharePoint} · {size}</div>
    </div>
    <span className="id-mono muted" style={{ fontSize: 11 }}>Issued {issued}</span>
    <span className={`badge ${status === "Verified" ? "verified" : "pending"}`}>{status}</span>
    <button className="btn btn-sm btn-ghost"><Icon name="download" size={11} /></button>
  </div>
);

window.ProfileView = ProfileView;
