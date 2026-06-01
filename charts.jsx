// Lightweight SVG charts

const BarChart = ({ data, height = 220, valueKey = "count", labelKey = "name", color = "var(--primary)", showLabels = true, onClick }) => {
  const max = Math.max(...data.map(d => d[valueKey]));
  const w = 100 / data.length;
  return (
    <div style={{ width: "100%" }}>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height: height - 30, display: "block" }}>
        {data.map((d, i) => {
          const h = (d[valueKey] / max) * (height - 50);
          return (
            <g key={i}>
              <rect
                x={i * w + w * 0.15}
                y={height - 30 - h}
                width={w * 0.7}
                height={h}
                fill={color}
                opacity={0.85}
                style={{ cursor: onClick ? "pointer" : "default" }}
                onClick={() => onClick && onClick(d)}
              />
              <rect x={i * w + w * 0.15} y={height - 30 - h - 1} width={w * 0.7} height={1} fill={color} />
            </g>
          );
        })}
      </svg>
      {showLabels && (
        <div style={{ display: "flex", marginTop: 6 }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 2px" }}>
              {d[labelKey]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LineChart = ({ data, valueKey = "count", labelKey = "year", height = 200, color = "var(--primary)", fill = "var(--primary-soft)" }) => {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d[valueKey]));
  const min = 0;
  const W = 600, H = height;
  const padL = 36, padR = 16, padT = 16, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x = i => padL + (i / (data.length - 1)) * innerW;
  const y = v => padT + innerH - ((v - min) / (max - min || 1)) * innerH;

  const pathLine = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d[valueKey]).toFixed(1)}`).join(' ');
  const pathArea = `${pathLine} L ${x(data.length - 1)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  const ticks = [0, 0.5, 1].map(t => Math.round(max * t));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height, display: "block" }}>
      {ticks.map((t, i) => {
        const yy = y(t);
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yy} y2={yy} stroke="var(--border)" strokeDasharray="2 3" />
            <text x={padL - 6} y={yy + 3} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill="var(--muted)">{t}</text>
          </g>
        );
      })}
      <path d={pathArea} fill={fill} />
      <path d={pathLine} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {data.map((d, i) => (
        <circle key={i} cx={x(i)} cy={y(d[valueKey])} r="2.5" fill={color} />
      ))}
      {data.map((d, i) => {
        if (i % Math.max(1, Math.floor(data.length / 8)) !== 0) return null;
        return (
          <text key={i} x={x(i)} y={H - padB + 14} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--muted)">
            {d[labelKey]}
          </text>
        );
      })}
    </svg>
  );
};

const Donut = ({ value, size = 96, stroke = 8, color = "var(--primary)", label }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--bg-2)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontSize={size / 4} fontWeight="600" fontFamily="var(--font-sans)" fill="var(--text)">
        {value}%
      </text>
      {label && <text x={size / 2} y={size / 2 + 18} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--muted)">{label}</text>}
    </svg>
  );
};

const PieChart = ({ data, valueKey = "count", labelKey = "name", size = 180, colors }) => {
  const total = data.reduce((a, b) => a + b[valueKey], 0);
  const palette = colors || ["#D56C38", "#65735C", "#D5A62A", "#8B4D2C", "#A8331F", "#4F5C48", "#B07A0E", "#C99A4E"];
  let acc = 0;
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const v = d[valueKey];
        const startA = (acc / total) * 2 * Math.PI - Math.PI / 2;
        acc += v;
        const endA = (acc / total) * 2 * Math.PI - Math.PI / 2;
        const x1 = cx + r * Math.cos(startA);
        const y1 = cy + r * Math.sin(startA);
        const x2 = cx + r * Math.cos(endA);
        const y2 = cy + r * Math.sin(endA);
        const large = endA - startA > Math.PI ? 1 : 0;
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
            fill={palette[i % palette.length]}
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="white" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="20" fontWeight="600" fontFamily="var(--font-sans)" fill="var(--text)">{total.toLocaleString()}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--muted)">TOTAL</text>
    </svg>
  );
};

// SA province map — simplified rectangles approximating geographic layout
const SAMap = ({ counts, activeProvince, onSelect }) => {
  // Geographic-ish layout (not actual borders — schematic blocks)
  const provs = [
    { id: "Limpopo", x: 200, y: 30, w: 130, h: 70 },
    { id: "Mpumalanga", x: 270, y: 100, w: 90, h: 65 },
    { id: "Gauteng", x: 215, y: 110, w: 55, h: 40 },
    { id: "North West", x: 110, y: 95, w: 105, h: 65 },
    { id: "KwaZulu-Natal", x: 260, y: 165, w: 110, h: 95 },
    { id: "Free State", x: 165, y: 160, w: 95, h: 70 },
    { id: "Northern Cape", x: 30, y: 105, w: 135, h: 110 },
    { id: "Eastern Cape", x: 130, y: 215, w: 150, h: 85 },
    { id: "Western Cape", x: 20, y: 215, w: 160, h: 90 }
  ];
  const max = Math.max(...counts.map(c => c.count));
  return (
    <svg viewBox="0 0 400 320" className="sa-map">
      <rect x="0" y="0" width="400" height="320" fill="var(--bg-2)" />
      {provs.map(p => {
        const c = counts.find(c => c.name === p.id) || { count: 0 };
        const intensity = c.count / max;
        const fill = activeProvince === p.id
          ? "var(--primary)"
          : `oklch(${92 - intensity * 32}% ${0.02 + intensity * 0.10} 55)`;
        return (
          <g key={p.id}>
            <rect
              x={p.x} y={p.y} width={p.w} height={p.h}
              rx="4"
              fill={fill}
              stroke="white"
              strokeWidth="1.5"
              style={{ cursor: "pointer", transition: "fill 0.12s" }}
              onClick={() => onSelect && onSelect(p.id)}
            />
            <text x={p.x + p.w / 2} y={p.y + p.h / 2 - 2} textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="var(--font-sans)" fill={activeProvince === p.id || intensity > 0.6 ? "white" : "var(--text)"} style={{ pointerEvents: "none" }}>
              {p.id.length > 12 ? p.id.split(" ").map(w => w[0]).join("") : p.id}
            </text>
            <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 9} textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="var(--font-mono)" fill={activeProvince === p.id || intensity > 0.6 ? "white" : "var(--text-2)"} style={{ pointerEvents: "none" }}>
              {c.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Sparkbar = ({ data, height = 32 }) => {
  const max = Math.max(...data);
  return (
    <div className="sparkbar" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (v / max) * 0.6 }} />
      ))}
    </div>
  );
};

window.BarChart = BarChart;
window.LineChart = LineChart;
window.Donut = Donut;
window.PieChart = PieChart;
window.SAMap = SAMap;
window.Sparkbar = Sparkbar;
