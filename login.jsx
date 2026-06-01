// Sign-in screen — redesigned for board-presentation quality
const LoginScreen = ({ onLogin }) => {
  const [view, setView] = React.useState("login");
  const [email, setEmail] = React.useState("l.mothapo@kagiso.org.za");
  const [password, setPassword] = React.useState("••••••••••••");
  const [role, setRole] = React.useState("Admin");
  const [remember, setRemember] = React.useState(true);
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetSent, setResetSent] = React.useState(false);

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

  const submitForgot = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      window.alert("Please enter your work email address.");
      return;
    }
    setResetSent(true);
  };

  const goBack = () => {
    setView("login");
    setResetEmail("");
    setResetSent(false);
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
        <form className="login-card" onSubmit={view === "login" ? submit : submitForgot}>
          <div className="login-form-head">
            <h2>{view === "login" ? "Welcome back" : "Reset your password"}</h2>
            <p>{view === "login" ? "Sign in to the CSO Database to continue." : "Enter your work email and we will send a reset link or OTP if your account exists."}</p>
          </div>

          {view === "login" ? (
            <>
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
                    onClick={() => setView("forgot")}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setView("forgot"); }}
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
            </>
          ) : (
            <>
              {resetSent ? (
                <div style={{ padding: "24px 0", fontSize: 14, lineHeight: 1.6 }}>
                  <div style={{ marginBottom: 16, fontWeight: 600 }}>Almost there</div>
                  <p>We&apos;ve sent a password reset link or OTP to <strong>{resetEmail}</strong> if it is registered in the system.</p>
                  <p>If you don&apos;t receive an email within a few minutes, please check your spam folder or contact support.</p>
                  <button type="button" className="btn btn-secondary" onClick={goBack}>Back to sign in</button>
                </div>
              ) : (
                <>
                  <div className="field">
                    <label className="field-label">Work email</label>
                    <input className="input" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="name@kagiso.org.za" />
                  </div>

                  <button type="submit" className="btn btn-primary login-submit">
                    Send reset link / OTP
                  </button>

                  <div className="login-meta">
                    If your email is registered, you will receive a secure password reset link or OTP. No information is revealed if the address is not found.
                  </div>

                  <div className="login-register" style={{ marginTop: 16 }}>
                    <span className="muted">Need extra help? </span>
                    <a href="mailto:support@kagiso.org.za" className="faux-link">Contact support</a>
                  </div>

                  <div className="login-register" style={{ marginTop: 12 }}>
                    <span className="faux-link" onClick={goBack}>Back to sign in</span>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
