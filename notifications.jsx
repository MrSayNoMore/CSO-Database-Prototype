// Notifications dropdown panel
const NotificationsPanel = ({ onClose, onNav }) => {
  const items = [
    { id: 1, type: "warn", icon: "warn", title: "SARS pipeline schema drift", desc: "Column 'tax_status' renamed in last pull — manual review needed.", ts: "2h ago", route: "ingestion", unread: true },
    { id: 2, type: "flagged", icon: "git", title: "2 duplicate clusters need review", desc: "Probable matches found across DSD ↔ SARS sources.", ts: "4h ago", route: "quality", unread: true },
    { id: 3, type: "pending", icon: "user", title: "47 self-registrations pending", desc: "Awaiting CSSP staff verification — 12 newer than 5 days.", ts: "5h ago", route: "selfreg", unread: true },
    { id: 4, type: "verified", icon: "check", title: "Q1 data quality report ready", desc: "Auto-generated, awaiting Head of CSSP approval.", ts: "1d ago", route: "reports", unread: false },
    { id: 5, type: "info", icon: "download", title: "Weekly executive PDF dispatched", desc: "Sent to 4 recipients via Power BI subscription.", ts: "1d ago", route: "reports", unread: false },
    { id: 6, type: "info", icon: "database", title: "DSD weekly delta complete", desc: "412 new records, 88 updated, 14 flagged.", ts: "2d ago", route: "ingestion", unread: false },
    { id: 7, type: "info", icon: "user", title: "New user invited", desc: "B. Mokoena (Standard) received their onboarding email.", ts: "3d ago", route: "admin", unread: false }
  ];

  const unreadCount = items.filter(i => i.unread).length;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
      <div style={{
        position: "absolute",
        top: 46,
        right: 80,
        width: 380,
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        zIndex: 60,
        overflow: "hidden"
      }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Notifications</div>
            <div className="muted" style={{ fontSize: 11, fontFamily: "var(--font-mono)", marginTop: 1 }}>{unreadCount} unread</div>
          </div>
          <button className="btn btn-sm btn-ghost">Mark all read</button>
        </div>
        <div style={{ maxHeight: 420, overflowY: "auto" }}>
          {items.map(n => (
            <div
              key={n.id}
              onClick={() => { onClose(); onNav(n.route); }}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 11,
                padding: "11px 14px",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                background: n.unread ? "var(--panel-2)" : "transparent",
                alignItems: "flex-start"
              }}
            >
              <span className={`badge ${n.type}`} style={{ width: 26, height: 26, padding: 0, justifyContent: "center", borderRadius: 5, flexShrink: 0 }}>
                <Icon name={n.icon} size={12} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: n.unread ? 500 : 400, display: "flex", alignItems: "center", gap: 6 }}>
                  {n.title}
                  {n.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)" }} />}
                </div>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 2, lineHeight: 1.4 }}>{n.desc}</div>
              </div>
              <div className="muted" style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{n.ts}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 10, borderTop: "1px solid var(--border)", background: "var(--panel-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="muted" style={{ fontSize: 11.5, fontFamily: "var(--font-mono)" }}>Updated 2 min ago</span>
          <button className="btn btn-sm btn-ghost">Notification settings →</button>
        </div>
      </div>
    </>
  );
};

window.NotificationsPanel = NotificationsPanel;
