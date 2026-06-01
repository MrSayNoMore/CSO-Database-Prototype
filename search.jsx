// Advanced Search & CSO list
const SearchView = ({ onOpenProfile, initialFilters = {}, role, perms = {}, toast }) => {
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState({
    province: initialFilters.province || "",
    district: "",
    sector: "",
    type: "",
    status: "",
    source: "",
    minCompleteness: 0,
    ...initialFilters
  });
  const [selected, setSelected] = React.useState(new Set());
  const [sortBy, setSortBy] = React.useState("name");
  const [sortDir, setSortDir] = React.useState("asc");
  const [viewMode, setViewMode] = React.useState("list");
  const [savedOpen, setSavedOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const pageSize = 20;

  const filtered = React.useMemo(() => {
    return CSO_DATA.filter(c => {
      if (query && !(`${c.name} ${c.cso_number} ${c.contact} ${c.director}`).toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.province && c.province !== filters.province) return false;
      if (filters.district && c.district !== filters.district) return false;
      if (filters.sector && c.sector !== filters.sector) return false;
      if (filters.type && c.type !== filters.type) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.source && !c.sources.includes(filters.source)) return false;
      if (c.completeness < filters.minCompleteness) return false;
      return true;
    }).sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [query, filters, sortBy, sortDir]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const clearFilter = (k) => setFilters({ ...filters, [k]: k === 'minCompleteness' ? 0 : "" });
  const activeFilterChips = Object.entries(filters).filter(([k, v]) => v && v !== 0);

  const toggleSelect = (id) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const canExport = perms.canExport === true;
  const canLimitedExport = perms.canExport === "limited";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Search CSOs</h1>
          <p className="page-sub">Search across 420 records consolidated from DSD NPO Registry, CIPC NPC, SARS PBO and Kagiso-sourced data.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => setSavedOpen(!savedOpen)}>
            <Icon name="star" size={13} />
            Saved searches
            <span className="badge" style={{ marginLeft: 4 }}>{SAVED_SEARCHES.length}</span>
          </button>
          {canExport && (
            <button className="btn btn-primary" onClick={() => toast(`Exporting ${filtered.length} records to Excel…`)}>
              <Icon name="download" size={13} />
              Export {selected.size > 0 ? `${selected.size} selected` : filtered.length.toLocaleString() + " results"}
            </button>
          )}
          {canLimitedExport && (
            <button className="btn btn-primary" disabled={filtered.length > 1000} onClick={() => toast(`Exporting ${Math.min(filtered.length, 1000)} records (Standard user limit)…`)}>
              <Icon name="download" size={13} />
              Export {selected.size > 0 ? `${selected.size} selected` : Math.min(filtered.length, 1000).toLocaleString() + " (max 1k)"}
            </button>
          )}
          {!canExport && !canLimitedExport && (
            <span className="badge" title="Read-Only users cannot export">
              <Icon name="lock" size={10} /> Export disabled
            </span>
          )}
        </div>
      </div>

      {/* Search bar + view toggle */}
      <div className="panel" style={{ marginBottom: 12 }}>
        <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "center", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 6 }}>
            <Icon name="search" size={15} className="muted" />
            <input
              autoFocus
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(0); }}
              placeholder="Search by name, CSO number, contact, director…"
              style={{ flex: 1, border: 0, outline: 0, background: "transparent", fontSize: 13, fontFamily: "inherit" }}
            />
            {query && <span className="x" style={{ cursor: "pointer", color: "var(--muted)" }} onClick={() => setQuery("")}><Icon name="x" size={14} /></span>}
            <span className="kbd">⌘K</span>
          </div>
          <div style={{ display: "flex", gap: 4, padding: 3, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 6 }}>
            {[["list", "List"], ["map", "Map"], ["card", "Cards"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setViewMode(id)} className="btn btn-sm" style={{ padding: "3px 9px", background: viewMode === id ? "var(--panel)" : "transparent", boxShadow: viewMode === id ? "var(--shadow)" : "none" }}>
                <Icon name={id === 'list' ? 'grid' : id === 'map' ? 'map' : 'layers'} size={12} />
                {lbl}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => toast("Saved current search")}>
            <Icon name="plus" size={13} />
            Save
          </button>
        </div>

        {/* Filter row */}
        <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "repeat(5, 1fr) auto", gap: 8, alignItems: "center", background: "var(--panel-2)", borderBottom: "1px solid var(--border)" }}>
          <select className="select" value={filters.province} onChange={e => { setFilters({ ...filters, province: e.target.value, district: "" }); setPage(0); }}>
            <option value="">All provinces</option>
            {PROVINCES.map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="select" value={filters.district} onChange={e => { setFilters({ ...filters, district: e.target.value }); setPage(0); }} disabled={!filters.province}>
            <option value="">All districts</option>
            {filters.province && DISTRICTS[filters.province].map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="select" value={filters.sector} onChange={e => { setFilters({ ...filters, sector: e.target.value }); setPage(0); }}>
            <option value="">All sectors</option>
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="select" value={filters.type} onChange={e => { setFilters({ ...filters, type: e.target.value }); setPage(0); }}>
            <option value="">All types</option>
            {ORG_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="select" value={filters.status} onChange={e => { setFilters({ ...filters, status: e.target.value }); setPage(0); }}>
            <option value="">Any status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Flagged</option>
          </select>
          <button className="btn btn-ghost" onClick={() => setFilters({ province: "", district: "", sector: "", type: "", status: "", source: "", minCompleteness: 0 })}>
            <Icon name="x" size={12} /> Reset
          </button>
        </div>

        {/* Active chips + result count */}
        <div style={{ padding: "9px 14px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
            <strong style={{ color: "var(--text)" }}>{filtered.length.toLocaleString()}</strong>
            <span className="muted"> of {CSO_DATA.length.toLocaleString()} records</span>
          </span>
          {activeFilterChips.length > 0 && <span className="muted" style={{ fontSize: 12 }}>·</span>}
          {activeFilterChips.map(([k, v]) => (
            <span key={k} className="tag-chip">
              {k}: {v}
              <span className="x" onClick={() => clearFilter(k)}><Icon name="x" size={11} /></span>
            </span>
          ))}
          <div style={{ flex: 1 }} />
          {selected.size > 0 && (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12 }}><strong>{selected.size}</strong> selected</span>
              {(canExport || canLimitedExport) && <button className="btn btn-sm btn-secondary"><Icon name="download" size={11} /> Export</button>}
              <button className="btn btn-sm btn-secondary"><Icon name="folder" size={11} /> Add to list</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setSelected(new Set())}>Clear</button>
            </div>
          )}
        </div>
      </div>

      {/* Saved searches dropdown */}
      {savedOpen && (
        <div className="panel" style={{ marginBottom: 12 }}>
          <div className="panel-head">
            <div className="panel-title"><Icon name="star" size={14} /> Saved searches</div>
            <button className="btn btn-sm btn-ghost" onClick={() => setSavedOpen(false)}><Icon name="x" size={12} /></button>
          </div>
          <div style={{ padding: 0 }}>
            {SAVED_SEARCHES.map(s => (
              <div key={s.id} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center", cursor: "pointer" }} onClick={() => { toast(`Loaded "${s.name}"`); setSavedOpen(false); }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                  <div className="muted" style={{ fontSize: 11.5, fontFamily: "var(--font-mono)", marginTop: 1 }}>{s.filters}</div>
                </div>
                <span className="badge">{s.count} results</span>
                <Icon name="arrowRight" size={13} className="muted" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === "list" && (
        <div className="panel panel-tight">
          <div className="scroll-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 30 }}>
                    <input type="checkbox" checked={selected.size === paged.length && paged.length > 0}
                      onChange={() => {
                        if (selected.size === paged.length) setSelected(new Set());
                        else setSelected(new Set(paged.map(p => p.id)));
                      }}
                      style={{ accentColor: "var(--primary)" }}/>
                  </th>
                  <SortableTh col="cso_number" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort}>CSO No.</SortableTh>
                  <SortableTh col="name" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort}>Organisation</SortableTh>
                  <SortableTh col="sector" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort}>Sector</SortableTh>
                  <SortableTh col="province" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort}>Location</SortableTh>
                  <SortableTh col="dateReg" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort}>Registered</SortableTh>
                  <SortableTh col="completeness" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort}>Quality</SortableTh>
                  <SortableTh col="status" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort}>Status</SortableTh>
                  <th>Sources</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && (
                  <tr><td colSpan="9" className="empty">No records match your filters. Try removing some criteria.</td></tr>
                )}
                {paged.map(c => (
                  <tr key={c.id} className={selected.has(c.id) ? "selected" : ""}>
                    <td>
                      <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} style={{ accentColor: "var(--primary)" }}/>
                    </td>
                    <td className="id-mono">{c.cso_number}</td>
                    <td>
                      <div onClick={() => onOpenProfile(c)} style={{ cursor: "pointer" }}>
                        <div style={{ fontWeight: 500 }}>{c.name}</div>
                        <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>{c.type} · {c.director}</div>
                      </div>
                    </td>
                    <td><span className="badge">{c.sector}</span></td>
                    <td>
                      <div>{c.city}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{c.province}</div>
                    </td>
                    <td className="id-mono muted">{c.dateReg}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 50, height: 5, background: "var(--bg-2)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${c.completeness}%`, height: "100%", background: c.completeness >= 85 ? "var(--primary)" : c.completeness >= 65 ? "var(--warn)" : "var(--danger)" }} />
                        </div>
                        <span className="id-mono" style={{ fontSize: 11 }}>{c.completeness}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${c.status === "Verified" ? "verified" : c.status === "Pending" ? "pending" : "flagged"}`}>
                        <span className="dot"></span>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 3 }}>
                        {c.sources.map(s => <span key={s} className="badge info" style={{ fontSize: 9.5, padding: "1px 5px" }}>{s}</span>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", fontSize: 12 }}>
            <span className="muted">
              Showing <strong style={{ color: "var(--text)" }}>{page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)}</strong> of <strong style={{ color: "var(--text)" }}>{filtered.length.toLocaleString()}</strong>
            </span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button className="btn btn-sm btn-ghost" disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))}>
                <Icon name="arrowLeft" size={12} /> Previous
              </button>
              <span style={{ padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
                Page {page + 1} of {totalPages}
              </span>
              <button className="btn btn-sm btn-ghost" disabled={page >= totalPages - 1} onClick={() => setPage(Math.min(totalPages - 1, page + 1))}>
                Next <Icon name="arrowRight" size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === "map" && (
        <div className="panel">
          <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
            <SAMap counts={PROVINCE_COUNTS} activeProvince={filters.province} onSelect={p => setFilters({ ...filters, province: p })} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>
                {filters.province ? `${filtered.length} CSOs in ${filters.province}` : "Click a province to drill down"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 460, overflowY: "auto" }}>
                {filtered.slice(0, 50).map(c => (
                  <div key={c.id} style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer" }} onClick={() => onOpenProfile(c)}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{c.name}</span>
                      <span className={`badge ${c.status === "Verified" ? "verified" : "pending"}`}>{c.status}</span>
                    </div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{c.sector} · {c.city}, {c.province}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === "card" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {paged.map(c => (
            <div key={c.id} className="panel" style={{ cursor: "pointer" }} onClick={() => onOpenProfile(c)}>
              <div className="panel-body">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                  <div className="profile-mark" style={{ width: 36, height: 36, fontSize: 14, borderRadius: 6 }}>
                    {c.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.2 }}>{c.name}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{c.cso_number}</div>
                  </div>
                  <span className={`badge ${c.status === "Verified" ? "verified" : c.status === "Pending" ? "pending" : "flagged"}`}>{c.status}</span>
                </div>
                <div className="divider" style={{ margin: "10px 0" }}/>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 10px", fontSize: 11.5 }}>
                  <span className="muted">Sector</span><span>{c.sector}</span>
                  <span className="muted">Location</span><span>{c.city}, {c.province}</span>
                  <span className="muted">Director</span><span>{c.director}</span>
                  <span className="muted">Beneficiaries</span><span>{c.beneficiaries.toLocaleString()} / yr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SortableTh = ({ children, col, sortBy, sortDir, onSort }) => (
  <th onClick={() => onSort(col)} style={{ cursor: "pointer", userSelect: "none" }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
      {sortBy === col && <span style={{ fontSize: 10 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
    </span>
  </th>
);

window.SearchView = SearchView;
