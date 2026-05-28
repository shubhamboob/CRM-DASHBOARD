import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { getRMData, rmColors, monthKeys } from "../data/crmData";
import { TrendingUp, TrendingDown, AlertCircle, Building2, FileCheck, IndianRupee } from "lucide-react";

const cr  = v => `₹${Number(v).toFixed(2)} Cr`;
const pct = v => `${Number(v).toFixed(1)}%`;
const pctColor = v => v >= 80 ? "var(--accent-green)" : v >= 50 ? "var(--accent-amber)" : "var(--accent-red)";

// ─── Small tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: "Times New Roman" }}>
      <div style={{ color: "var(--text-secondary)", marginBottom: 4, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: "flex", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block", marginTop: 3 }} />
          {p.name}: <strong>{typeof p.value === "number" && p.name !== "Bookings" && p.name !== "Pending Reg" ? `₹${p.value.toFixed(2)} Cr` : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── RM Avatar ───────────────────────────────────────────────────────────────
function RMAvatar({ name, size = 40 }) {
  const color = rmColors[name] || "#4fb3ff";
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.38, color: "#000", fontFamily: "Times New Roman", flexShrink: 0, boxShadow: `0 0 0 3px rgba(${hexToRgb(color)},0.25)` }}>
      {initials}
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function Bar2({ value, max, color }) {
  const w = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 3, transition: "width 0.7s ease" }} />
    </div>
  );
}

// ─── Section title ────────────────────────────────────────────────────────────
function SectionTitle({ children, icon: Icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "32px 0 16px" }}>
      {Icon && <Icon size={18} color="var(--accent-blue)" />}
      <h2 style={{ fontFamily: "Times New Roman", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em" }}>{children}</h2>
      <div style={{ flex: 1, height: 1, background: "var(--border)", marginLeft: 8 }} />
    </div>
  );
}

// ─── RM Detail Drawer ─────────────────────────────────────────────────────────
function RMDetailDrawer({ rm, onClose }) {
  if (!rm) return null;
  const color = rmColors[rm.rm] || "var(--accent-blue)";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
      {/* Drawer */}
      <div style={{ width: 560, background: "var(--bg-card)", borderLeft: "1px solid var(--border-accent)", overflowY: "auto", animation: "slideIn 0.3s ease", padding: 28 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <RMAvatar name={rm.rm} size={52} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "Times New Roman" }}>{rm.rm}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{rm.assigned.map(p => p.replace("RAGHAV ", "")).join(" · ")}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", color: "var(--text-secondary)", cursor: "pointer", fontSize: 12, fontFamily: "Times New Roman" }}>✕ Close</button>
        </div>

        {/* Achievement gauge */}
        <div style={{ background: "var(--bg-secondary)", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Collection Achievement</span>
            <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "Times New Roman", color: pctColor(rm.achievement_pct) }}>{pct(rm.achievement_pct)}</span>
          </div>
          <Bar2 value={rm.achievement} max={rm.target} color={pctColor(rm.achievement_pct)} />
          <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12 }}>
            <span style={{ color: "var(--accent-blue)" }}>Target: {cr(rm.target)}</span>
            <span style={{ color: "var(--accent-amber)" }}>Forecast: {cr(rm.forecast)}</span>
            <span style={{ color: "var(--accent-green)" }}>Achievement: {cr(rm.achievement)}</span>
          </div>
        </div>

        {/* Key metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Live Bookings",       value: rm.live_bookings,          color: "var(--accent-blue)" },
            { label: "Monthly Collection",   value: cr(rm.monthly_collection), color: "var(--accent-cyan)" },
            { label: "Outstanding",          value: cr(rm.outstanding),        color: "var(--accent-amber)" },
            { label: "Pending Reg",          value: rm.pending_reg,            color: "var(--accent-red)", sub: `${rm.pending_reg_45d} over 45 days` },
            { label: "Monthly Reg Done",     value: rm.monthly_registrations,  color: "var(--accent-green)" },
            { label: "Collection Efficiency",value: pct(rm.collection_eff),    color: pctColor(rm.collection_eff) },
          ].map(m => (
            <div key={m.label} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "Times New Roman", color: m.color }}>{m.value}</div>
              {m.sub && <div style={{ fontSize: 11, color: "var(--accent-red)", marginTop: 3 }}>{m.sub}</div>}
            </div>
          ))}
        </div>

        {/* Project breakdown table */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Project Breakdown</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Project","Monthly Coll.","Outstanding","Pending Reg",">45d"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: h==="Project"?"left":"right", color: "var(--text-muted)", fontWeight: 600, fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rm.projects.map((p, i) => (
                <tr key={p.name} style={{ background: i%2===0?"transparent":"rgba(255,255,255,0.02)" }}>
                  <td style={{ padding: "10px 10px", color: "var(--text-primary)", fontWeight: 500 }}>{p.name.replace("RAGHAV ","")}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--accent-cyan)" }}>{cr(p.monthly_collection)}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right", color: "var(--accent-amber)" }}>{cr(p.outstanding)}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right" }}>{p.pending_reg}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right", color: p.pending_reg_45d > 3 ? "var(--accent-red)" : "var(--text-secondary)" }}>{p.pending_reg_45d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3-month trend chart */}
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>3-Month Collection Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={rm.trend} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Times New Roman" }} />
              <Bar dataKey="target"      name="Target"      fill="rgba(79,179,255,0.3)" stroke="var(--accent-blue)" strokeWidth={1} radius={[3,3,0,0]} />
              <Bar dataKey="forecast"    name="Forecast"    fill="var(--accent-amber)" fillOpacity={0.75} radius={[3,3,0,0]} />
              <Bar dataKey="achievement" name="Achievement" fill="var(--accent-green)" fillOpacity={0.85} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Main RM Tab ──────────────────────────────────────────────────────────────
export default function RMPerformanceTab({ data, monthKey }) {
  const [selectedRM, setSelectedRM] = useState(null);
  const rmData = getRMData(monthKey);

  // Leaderboard sorted by achievement_pct desc
  const ranked = [...rmData].sort((a, b) => b.achievement_pct - a.achievement_pct);

  // Comparison chart data
  const comparisonData = rmData.map(rm => ({
    name: rm.rm,
    Target: rm.target,
    Forecast: rm.forecast,
    Achievement: rm.achievement,
  }));

  // Outstanding comparison
  const outstandingData = rmData.map(rm => ({
    name: rm.rm,
    Outstanding: rm.outstanding,
    "Pending Reg": rm.pending_reg,
  }));

  // Collection efficiency radar
  const radarData = [
    { metric: "Achievement %", ...Object.fromEntries(rmData.map(r => [r.rm, r.achievement_pct])) },
    { metric: "Collection Eff.", ...Object.fromEntries(rmData.map(r => [r.rm, r.collection_eff])) },
    { metric: "Reg. Done",  ...Object.fromEntries(rmData.map(r => [r.rm, r.monthly_registrations * 20])) },
    { metric: "Demand Coverage", ...Object.fromEntries(rmData.map(r => [r.rm, r.collection_eff])) },
  ];

  // Trend data for all RMs across months
  const allMonthsTrend = monthKeys.map(mk => {
    const mkRmData = getRMData(mk);
    const entry = { month: mk.replace(" 2026","") };
    mkRmData.forEach(rm => { entry[rm.rm] = rm.monthly_collection; });
    return entry;
  });

  const rmNames = rmData.map(r => r.rm);
  const RANK_ICONS = ["🥇","🥈","🥉","4️⃣"];

  return (
    <>
      {/* Leaderboard hero */}
      <SectionTitle icon={Users}>RM Performance Leaderboard — {monthKey}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 8 }}>
        {ranked.map((rm, idx) => (
          <div key={rm.rm}
            onClick={() => setSelectedRM(rm)}
            style={{
              background: idx === 0 ? "linear-gradient(135deg, rgba(79,179,255,0.12), rgba(0,212,255,0.06))" : "var(--bg-card)",
              border: idx === 0 ? "1px solid var(--border-accent)" : "1px solid var(--border)",
              borderRadius: 14, padding: 22, cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              animation: "fadeIn 0.4s ease both",
              animationDelay: `${idx * 0.08}s`,
              position: "relative", overflow: "hidden"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = rmColors[rm.rm] || "var(--border-accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = idx === 0 ? "var(--border-accent)" : "var(--border)"; }}>

            {/* Rank badge */}
            <div style={{ position: "absolute", top: 14, right: 14, fontSize: 20 }}>{RANK_ICONS[idx]}</div>

            {/* RM info */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <RMAvatar name={rm.rm} size={44} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "Times New Roman" }}>{rm.rm}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {rm.assigned.map(p => p.replace("RAGHAV ","")).join(" · ")}
                </div>
              </div>
            </div>

            {/* Achievement % big number */}
            <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "Times New Roman", color: pctColor(rm.achievement_pct), lineHeight: 1, marginBottom: 8 }}>
              {pct(rm.achievement_pct)}
            </div>
            <Bar2 value={rm.achievement} max={rm.target} color={pctColor(rm.achievement_pct)} />

            {/* TVA line */}
            <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 11 }}>
              <span style={{ color: "var(--accent-blue)" }}>T: {cr(rm.target)}</span>
              <span style={{ color: "var(--accent-amber)" }}>F: {cr(rm.forecast)}</span>
              <span style={{ color: "var(--accent-green)" }}>A: {cr(rm.achievement)}</span>
            </div>

            {/* Quick stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
              {[
                { label: "Bookings",   value: rm.live_bookings,        icon: Building2,  color: "var(--accent-blue)" },
                { label: "Outstanding",value: cr(rm.outstanding),      icon: AlertCircle, color: "var(--accent-amber)" },
                { label: "Pending Reg",value: rm.pending_reg,          icon: FileCheck,   color: rm.pending_reg_45d > 5 ? "var(--accent-red)" : "var(--text-primary)" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Times New Roman", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)", textAlign: "right" }}>
              Click for full detail →
            </div>
          </div>
        ))}
      </div>

      {/* Head-to-head comparison chart */}
      <SectionTitle icon={IndianRupee}>Target · Forecast · Achievement Comparison (₹ Cr)</SectionTitle>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-primary)", fontFamily: "Times New Roman", fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Times New Roman" }} />
            <Bar dataKey="Target"      fill="rgba(79,179,255,0.3)"  stroke="var(--accent-blue)"  strokeWidth={1} radius={[4,4,0,0]} />
            <Bar dataKey="Forecast"    fill="var(--accent-amber)"    fillOpacity={0.75}            radius={[4,4,0,0]} />
            <Bar dataKey="Achievement" fill="var(--accent-green)"    fillOpacity={0.85}            radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Outstanding & Pending split */}
      <SectionTitle icon={AlertCircle}>Outstanding & Pending Registrations by RM</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Outstanding Amount (₹ Cr)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[...rmData].sort((a,b) => b.outstanding - a.outstanding).map(rm => (
              <div key={rm.rm}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RMAvatar name={rm.rm} size={22} />
                    <span style={{ fontWeight: 600 }}>{rm.rm}</span>
                  </div>
                  <span style={{ color: "var(--accent-amber)", fontWeight: 700 }}>{cr(rm.outstanding)}</span>
                </div>
                <Bar2 value={rm.outstanding} max={Math.max(...rmData.map(r => r.outstanding))} color="var(--accent-amber)" />
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Pending Registrations (Total · &gt;45 Days)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[...rmData].sort((a,b) => b.pending_reg - a.pending_reg).map(rm => (
              <div key={rm.rm}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RMAvatar name={rm.rm} size={22} />
                    <span style={{ fontWeight: 600 }}>{rm.rm}</span>
                  </div>
                  <span>
                    <span style={{ fontWeight: 700 }}>{rm.pending_reg}</span>
                    <span style={{ color: "var(--accent-red)", fontSize: 11, marginLeft: 6 }}>({rm.pending_reg_45d} &gt;45d)</span>
                  </span>
                </div>
                <Bar2 value={rm.pending_reg} max={Math.max(...rmData.map(r => r.pending_reg))} color={rm.pending_reg_45d > 5 ? "var(--accent-red)" : "var(--accent-amber)"} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-month collection trend */}
      <SectionTitle icon={TrendingUp}>3-Month Monthly Collection Trend by RM (₹ Cr)</SectionTitle>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={allMonthsTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Times New Roman" }} />
            {rmNames.map(rm => (
              <Line key={rm} type="monotone" dataKey={rm} stroke={rmColors[rm]} strokeWidth={2.5}
                dot={{ r: 5, fill: rmColors[rm], strokeWidth: 2, stroke: "var(--bg-primary)" }} activeDot={{ r: 7 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Collection efficiency & live bookings summary table */}
      <SectionTitle icon={Building2}>RM Summary Table</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--bg-card)" }}>
              {["RM","Projects","Live Bookings","Monthly Collection","Demand Raised","Collected Till Date","Outstanding","Pending Reg",">45 Days","Reg Done","Reg Targets","Collection Eff."].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: h==="RM"||h==="Projects"?"left":"right", color: "var(--text-muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", border: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rmData.map((rm, i) => (
              <tr key={rm.rm}
                onClick={() => setSelectedRM(rm)}
                style={{ background: i%2===0?"transparent":"rgba(255,255,255,0.015)", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = i%2===0?"transparent":"rgba(255,255,255,0.015)"}>
                {/* RM cell */}
                <td style={{ padding: "12px 14px", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RMAvatar name={rm.rm} size={28} />
                    <span style={{ fontWeight: 700 }}>{rm.rm}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 11 }}>
                  {rm.assigned.map(p => p.replace("RAGHAV ","")).join(", ")}
                </td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)" }}>{rm.live_bookings}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)", color: "var(--accent-cyan)" }}>{cr(rm.monthly_collection)}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)" }}>{cr(rm.demand_raised)}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)" }}>{cr(rm.collection_till_date)}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)", color: "var(--accent-amber)" }}>{cr(rm.outstanding)}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)" }}>{rm.pending_reg}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)", color: rm.pending_reg_45d > 5 ? "var(--accent-red)" : "var(--text-primary)" }}>{rm.pending_reg_45d}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)", color: "var(--accent-green)" }}>{rm.monthly_registrations}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)" }}>{rm.reg_targets}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)", fontWeight: 700, color: pctColor(rm.collection_eff) }}>{pct(rm.collection_eff)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selectedRM && <RMDetailDrawer rm={selectedRM} onClose={() => setSelectedRM(null)} />}
    </>
  );
}
