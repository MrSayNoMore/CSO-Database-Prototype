// Sign-in screen — redesigned for board-presentation quality
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = React.useState("l.mothapo@kagiso.org.za");
  const [password, setPassword] = React.useState("••••••••••••");
  const [role, setRole] = React.useState("Admin");
  const [remember, setRemember] = React.useState(true);

  const roles = [
    { id: "Admin", label: "Administrator", desc: "Full system access" },
    { id: "Power User", label: "Power User", desc: "Search, export, dashboards" },
    { id: "Standard", label: "Standard User", desc: "Search & view profiles" },
    { id: "Read-Only", label: "Read-Only", desc: "View only, no exports" }
  ];

  const submit = (e) => {
    e.preventDefault();
    onLogin({ email, role });
  };

  return (
    <div className="login-shell">
      {/* LEFT — brand */}
      <div className="login-left">
        <div className="login-watermark-wrap" aria-hidden="true">
          <img src="assets/kagiso-watermark.png" alt="" className="login-watermark" />
        </div>

        <div className="login-wordmark">
          <img src="assets/kagiso-logo.png" alt="Kagiso Trust" />
        </div>

        <div className="login-hero">
          <div className="login-eyebrow">CSSP &middot; Civil Society Support Programme</div>
          <h1 className="login-headline">
            One unified view of <em>South Africa&apos;s</em> civil society sector.
          </h1>
          <p className="login-lede">
            Consolidating DSD, CIPC and SARS into a single, searchable record &mdash; so Kagiso Trust can target support with precision, transparency, and impact.
          </p>
        </div>

        <div className="login-stats">
          <div className="login-stat">
            <div className="login-stat-num">400k+</div>
            <div className="login-stat-lbl">CSO records<br/>consolidated</div>
          </div>
          <div className="login-stat-divider" />
          <div className="login-stat">
            <div className="login-stat-num">9</div>
            <div className="login-stat-lbl">provinces<br/>covered</div>
          </div>
          <div className="login-stat-divider" />
          <div className="login-stat">
            <div className="login-stat-num">3</div>
            <div className="login-stat-lbl">authoritative<br/>data sources</div>
          </div>
        </div>

        <div className="login-foot">
          <span><span className="dot"></span> POPIA-compliant</span>
          <span><span className="dot"></span> FATF-aligned</span>
          <span><span className="dot"></span> Azure AD SSO</span>
        </div>
      </div>

      {/* RIGHT — sign-in form */}
      <div className="login-right">
        <form className="login-card" onSubmit={submit}>
          <div className="login-form-head">
            <h2>Welcome back</h2>
            <p>Sign in to the CSO Database to continue.</p>
          </div>

          <div className="field">
            <label className="field-label">Work email</label>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@kagiso.org.za" />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="field-label">Password</label>
              <span
                className="faux-link"
                style={{ fontSize: 11, cursor: "pointer" }}
                role="button"
                tabIndex={0}
                onClick={() => window.alert("Forgot password? Please contact your administrator or email support@kagiso.org.za for a password reset.")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") window.alert("Forgot password? Please contact your administrator or email support@kagiso.org.za for a password reset."); }}
              >
                Forgot password?
              </span>
            </div>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <label className="checkbox" style={{ marginTop: 12 }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            <span style={{ fontSize: 12 }}>Keep me signed in on this device</span>
          </label>

          <div className="login-divider"><span>Demo · continue as</span></div>

          <div className="role-grid">
            {roles.map(r => (
              <div key={r.id} className={`role-chip ${role === r.id ? 'active' : ''}`} onClick={() => setRole(r.id)}>
                <div className="rl">{r.label}</div>
                <div className="rd">{r.desc}</div>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary login-submit">
            <Icon name="lock" size={14} />
            Sign in with Azure AD SSO
          </button>

          <div className="login-meta">
            By signing in you agree to POPIA-compliant data handling and Kagiso Trust&apos;s <span className="faux-link">acceptable use policy</span>.
          </div>

          <div className="login-register">
            <span className="muted">Are you a CSO representative? </span>
            <span className="faux-link" onClick={() => onLogin({ public: true })}>Register your organisation →</span>
          </div>
        </form>
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
