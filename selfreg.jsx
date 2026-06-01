// Self-registration public portal — multi-step
const SelfRegPortal = ({ onExit }) => {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({
    orgName: "",
    type: "NPO",
    npoNumber: "",
    sector: "",
    province: "",
    district: "",
    city: "",
    address: "",
    postalCode: "",
    email: "",
    phone: "",
    director: "",
    contact: "",
    service: "",
    beneficiaries: "",
    npoCert: null,
    sarsCert: null,
    financials: null,
    consent: false
  });
  const [submitted, setSubmitted] = React.useState(false);

  const setField = (k, v) => setForm({ ...form, [k]: v });

  const steps = ["Organisation", "Contact & Location", "Service Profile", "Documents", "Review"];

  const next = () => setStep(Math.min(steps.length - 1, step + 1));
  const back = () => setStep(Math.max(0, step - 1));

  if (submitted) {
    return (
      <div className="public-shell">
        <div className="public-nav">
        <img src="assets/kagiso-logo.png" alt="Kagiso Trust" style={{ height: 32 }} />
        <div style={{ width: 1, height: 22, background: "var(--border)" }} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>CSO Self-Registration Portal</span>
          <span className="muted" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>CSSP · Civil Society Support Programme</span>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost" onClick={onExit}><Icon name="arrowLeft" size={13} /> Back to staff sign-in</button>
      </div>

      <div className="public-content" style={{ marginTop: 64 }}>
        <div className="panel" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--olive-soft)", color: "var(--olive-2)", display: "inline-grid", placeItems: "center", marginBottom: 16 }}>
            <Icon name="check" size={28} />
          </div>
            <h2 style={{ fontSize: 22, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Registration submitted</h2>
            <p style={{ color: "var(--muted)", maxWidth: 460, margin: "0 auto 20px", fontSize: 13.5 }}>
              Thank you. Your reference number is <strong className="id-mono" style={{ color: "var(--text)" }}>SR-2026-04127</strong>. A CSSP team member will review your submission within 5 working days and contact <strong style={{ color: "var(--text)" }}>{form.email || "the email you provided"}</strong>.
            </p>
            <div style={{ display: "inline-flex", gap: 8 }}>
              <button className="btn btn-secondary" onClick={onExit}>Return to home</button>
              <button className="btn btn-primary" onClick={() => { setSubmitted(false); setStep(0); setForm({ ...form, orgName: "" }); }}>Register another organisation</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-shell">
      <div className="public-nav">
        <img src="assets/kagiso-logo.png" alt="Kagiso Trust" style={{ height: 32 }} />
        <div style={{ width: 1, height: 22, background: "var(--border)" }} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>CSO Self-Registration Portal</span>
          <span className="muted" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>CSSP · Civil Society Support Programme</span>
        </div>
        <div style={{ flex: 1 }} />
        <span className="badge info"><Icon name="lock" size={10} /> POPIA-compliant submission</span>
        <button className="btn btn-ghost" onClick={onExit}><Icon name="arrowLeft" size={13} /> Staff sign-in</button>
      </div>

      <div className="public-content">
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Register your organisation</h1>
        <p style={{ color: "var(--muted)", fontSize: 13.5, margin: "0 0 26px", maxWidth: 580 }}>
          Joining the CSO Database makes your organisation visible to funders, partners and the CSSP programme team. Registration takes about 8 minutes.
        </p>

        <div className="stepper">
          {steps.map((s, i) => (
            <div key={s} className={`step ${i === step ? "active" : i < step ? "done" : ""}`}>
              <span className="num">0{i + 1}</span> · {s}
            </div>
          ))}
        </div>

        <div className="panel">
          <div style={{ padding: 24 }}>
            {step === 0 && (
              <div style={{ display: "grid", gap: 14 }}>
                <div className="field">
                  <label className="field-label">Organisation legal name *</label>
                  <input className="input" value={form.orgName} onChange={e => setField("orgName", e.target.value)} placeholder="e.g. Ubuntu Community Foundation" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label className="field-label">Organisation type *</label>
                    <select className="select" value={form.type} onChange={e => setField("type", e.target.value)}>
                      {ORG_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">NPO / NPC number *</label>
                    <input className="input" value={form.npoNumber} onChange={e => setField("npoNumber", e.target.value)} placeholder="e.g. 088-952-NPO" />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Primary sector *</label>
                  <select className="select" value={form.sector} onChange={e => setField("sector", e.target.value)}>
                    <option value="">Select a sector…</option>
                    {SECTORS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Date organisation was established</label>
                  <input className="input" type="date" defaultValue="2018-03-14" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{ display: "grid", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label className="field-label">Director / Lead person *</label>
                    <input className="input" value={form.director} onChange={e => setField("director", e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="field-label">Primary contact person *</label>
                    <input className="input" value={form.contact} onChange={e => setField("contact", e.target.value)} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label className="field-label">Email *</label>
                    <input className="input" type="email" value={form.email} onChange={e => setField("email", e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="field-label">Telephone *</label>
                    <input className="input" value={form.phone} onChange={e => setField("phone", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Physical address *</label>
                  <textarea className="textarea" rows="2" value={form.address} onChange={e => setField("address", e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label className="field-label">Province *</label>
                    <select className="select" value={form.province} onChange={e => setField("province", e.target.value)}>
                      <option value="">Select…</option>
                      {PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">District *</label>
                    <select className="select" value={form.district} onChange={e => setField("district", e.target.value)} disabled={!form.province}>
                      <option value="">Select…</option>
                      {form.province && DISTRICTS[form.province].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">City / town *</label>
                    <input className="input" value={form.city} onChange={e => setField("city", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Postal code *</label>
                  <input className="input" style={{ maxWidth: 160 }} value={form.postalCode} onChange={e => setField("postalCode", e.target.value)} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "grid", gap: 14 }}>
                <div className="field">
                  <label className="field-label">Describe the primary service your organisation provides *</label>
                  <textarea className="textarea" rows="4" value={form.service} onChange={e => setField("service", e.target.value)} placeholder="e.g. After-school tutoring for grades 1-7 in Khayelitsha, with literacy &amp; numeracy focus." />
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>{form.service.length} / 1000 characters</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label className="field-label">Annual beneficiaries reached</label>
                    <input className="input" type="number" value={form.beneficiaries} onChange={e => setField("beneficiaries", e.target.value)} placeholder="e.g. 1200" />
                  </div>
                  <div className="field">
                    <label className="field-label">Funding model</label>
                    <select className="select" defaultValue="">
                      <option value="">Select…</option>
                      <option>Donor-funded</option>
                      <option>Lotteries Commission</option>
                      <option>Government grant</option>
                      <option>Self-funded</option>
                      <option>Mixed</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Areas of operation (provinces served)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {PROVINCES.map(p => (
                      <label key={p} className="checkbox" style={{ padding: "5px 9px", border: "1px solid var(--border)", borderRadius: 4 }}>
                        <input type="checkbox" defaultChecked={p === form.province} />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px" }}>
                  Please upload these compliance documents. Files are stored in <strong>Kagiso SharePoint</strong> and access-controlled per POPIA.
                </p>
                <DocUploader label="NPO / NPC certificate *" required toast={(m) => null} field="npoCert" form={form} setField={setField} />
                <DocUploader label="SARS PBO approval (if applicable)" field="sarsCert" form={form} setField={setField} />
                <DocUploader label="Latest audited financial statements" field="financials" form={form} setField={setField} />
                <DocUploader label="Board constitution or founding document" field="constitution" form={form} setField={setField} />
              </div>
            )}

            {step === 4 && (
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12 }}>Review your submission</div>
                <div className="detail-grid" style={{ border: "1px solid var(--border)", borderRadius: 6 }}>
                  <Detail2 label="Organisation" value={form.orgName || "—"} />
                  <Detail2 label="Type" value={form.type} />
                  <Detail2 label="NPO/NPC number" value={form.npoNumber || "—"} mono />
                  <Detail2 label="Sector" value={form.sector || "—"} />
                  <Detail2 label="Director" value={form.director || "—"} />
                  <Detail2 label="Contact" value={form.contact || "—"} />
                  <Detail2 label="Email" value={form.email || "—"} />
                  <Detail2 label="Phone" value={form.phone || "—"} mono />
                  <Detail2 label="Province / District" value={`${form.province || "—"} / ${form.district || "—"}`} />
                  <Detail2 label="City" value={form.city || "—"} />
                </div>

                <label className="checkbox" style={{ marginTop: 18, alignItems: "flex-start", gap: 9, lineHeight: 1.4 }}>
                  <input type="checkbox" checked={form.consent} onChange={e => setField("consent", e.target.checked)} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 12.5 }}>
                    I confirm the information provided is accurate and I authorise Kagiso Trust to process this data per the <span className="faux-link">POPIA privacy notice</span>. I understand that my organisation's profile may be visible to verified Kagiso Trust staff and approved funding partners.
                  </span>
                </label>
              </div>
            )}
          </div>

          <div style={{ padding: "12px 24px", borderTop: "1px solid var(--border)", background: "var(--panel-2)", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
            <div className="muted" style={{ fontSize: 11.5, fontFamily: "var(--font-mono)" }}>Auto-saved · {step + 1} / {steps.length}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {step > 0 && <button className="btn btn-secondary" onClick={back}><Icon name="arrowLeft" size={12} /> Back</button>}
              {step < steps.length - 1 ? (
                <button className="btn btn-primary" onClick={next}>Continue <Icon name="arrowRight" size={12} /></button>
              ) : (
                <button className="btn btn-primary" disabled={!form.consent} onClick={() => setSubmitted(true)}>
                  Submit registration <Icon name="check" size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 14, background: "var(--info-soft)", color: "var(--info)", borderRadius: 6, fontSize: 12, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="info" size={14} />
          <div>Need help? Email <strong>cssp@kagiso.org.za</strong> or call <strong>011 566 1900</strong> (Mon–Fri 8:00–16:30 SAST).</div>
        </div>
      </div>
    </div>
  );
};

const DocUploader = ({ label, required, field, form, setField }) => {
  const [uploaded, setUploaded] = React.useState(false);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, marginBottom: 8 }}>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</div>
        <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
          {uploaded ? <><Icon name="check" size={11} /> certificate.pdf · 412 KB</> : "PDF, JPG or PNG — max 10MB"}
        </div>
      </div>
      <button className={`btn btn-sm ${uploaded ? "btn-secondary" : "btn-primary"}`} onClick={() => setUploaded(!uploaded)}>
        {uploaded ? <><Icon name="check" size={11} /> Uploaded</> : <><Icon name="upload" size={11} /> Choose file</>}
      </button>
    </div>
  );
};

const Detail2 = ({ label, value, mono }) => (
  <div className="detail">
    <div className="detail-label">{label}</div>
    <div className="detail-value" style={mono ? { fontFamily: "var(--font-mono)", fontSize: 12.5 } : null}>{value}</div>
  </div>
);

window.SelfRegPortal = SelfRegPortal;
