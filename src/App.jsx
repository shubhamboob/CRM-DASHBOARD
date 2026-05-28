import { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { monthsData, monthKeys, projectColors, trendData, rmColors, getRMData } from "./data/crmData";
import RMPerformanceTab from "./components/RMPerformanceTab";
import { Bot, Send, X, ChevronDown, TrendingUp, TrendingDown, IndianRupee, Building2, FileCheck, AlertCircle, BarChart2, Layers, MessageSquare, Lock, Eye, EyeOff, LogOut, Users } from "lucide-react";

// ─── Auth Config ──────────────────────────────────────────────────────────────
const VALID_USERS = [
  { username: "crm.admin", password: "Raghav@CRM2026" },
  { username: "crm.user",  password: "Raghav@2026" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const cr = v => `₹${Number(v).toFixed(2)} Cr`;
const pct = v => `${Number(v).toFixed(1)}%`;
const pctColor = v => v >= 80 ? "var(--accent-green)" : v >= 50 ? "var(--accent-amber)" : "var(--accent-red)";

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const match = VALID_USERS.find(u => u.username === username.trim() && u.password === password);
      if (match) {
        sessionStorage.setItem("crm_auth", JSON.stringify({ user: username, ts: Date.now() }));
        onLogin(username);
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-primary)", fontFamily: "var(--font-body)",
    }}>
      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(79,179,255,0.06) 1px, transparent 0)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      <div style={{
        width: 400, background: "var(--bg-card)", border: "1px solid var(--border-accent)",
        borderRadius: 16, padding: 40, position: "relative",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(79,179,255,0.06)",
        animation: "fadeIn 0.5s ease"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Building2 size={26} color="#000" />
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, letterSpacing: "0.04em" }}>RAGHAV REALTY</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.12em", marginTop: 4 }}>CRM COMMAND CENTER</div>
        </div>

        <div style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Lock size={13} /> Restricted Access — Authorised Personnel Only
        </div>

        {/* Username */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Username</label>
          <input
            type="text" value={username} onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Enter username"
            style={{ width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, outline: "none", fontFamily: "var(--font-body)", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "var(--accent-blue)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24, position: "relative" }}>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter password"
              style={{ width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 40px 10px 14px", color: "var(--text-primary)", fontSize: 14, outline: "none", fontFamily: "var(--font-body)", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "var(--accent-blue)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 2 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--accent-red)", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading || !username || !password}
          style={{
            width: "100%", padding: "12px", borderRadius: 8, border: "none",
            background: loading || !username || !password ? "rgba(79,179,255,0.3)" : "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))",
            color: "#000", fontWeight: 700, fontSize: 14, cursor: loading || !username || !password ? "not-allowed" : "pointer",
            fontFamily: "var(--font-display)", letterSpacing: "0.04em", transition: "all 0.2s"
          }}>
          {loading ? "Verifying..." : "Sign In"}
        </button>

        <div style={{ marginTop: 20, fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
          This system contains confidential business data.<br />Unauthorised access is strictly prohibited.
        </div>
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, icon: Icon, trend }) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "20px",
      display: "flex", flexDirection: "column", gap: 8,
      animation: "fadeIn 0.4s ease both", transition: "border-color 0.2s, transform 0.2s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        {Icon && <Icon size={16} color={color || "var(--accent-blue)"} />}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-display)", color: color || "var(--text-primary)", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{sub}</div>}
      {trend !== undefined && (
        <div style={{ fontSize: 12, color: trend >= 0 ? "var(--accent-green)" : "var(--accent-red)", display: "flex", alignItems: "center", gap: 4 }}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend >= 0 ? "+" : ""}{trend.toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionTitle({ children, icon: Icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "32px 0 16px" }}>
      {Icon && <Icon size={18} color="var(--accent-blue)" />}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em" }}>{children}</h2>
      <div style={{ flex: 1, height: 1, background: "var(--border)", marginLeft: 8 }} />
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color }) {
  const pctVal = Math.min((value / max) * 100, 100);
  return (
    <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pctVal}%`, background: color || "var(--accent-blue)", borderRadius: 3, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontFamily: "var(--font-body)" }}>
      <div style={{ color: "var(--text-secondary)", marginBottom: 4, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          {p.name}: <strong>₹{Number(p.value).toFixed(2)} Cr</strong>
        </div>
      ))}
    </div>
  );
};

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
function AIChatPanel({ open, onClose, currentData, monthKey }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hello! I'm your CRM AI Assistant powered by Gemini. Ask me anything about collections, outstanding amounts, project performance, or registrations." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("gemini_api_key") || "");
  const [showApiInput, setShowApiInput] = useState(!sessionStorage.getItem("gemini_api_key"));
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const buildContext = () => {
    const d = currentData;
    const t = d.total;
    return `You are a CRM analytics assistant for Raghav Realty, a Mumbai-based real estate developer.
Current month: ${monthKey}
CRM Target: ₹${d.crm_target} Cr | Achievement: ₹${d.crm_achievement} Cr | % Achieved: ${d.crm_pct}%

Portfolio Summary:
- Live Bookings: ${t.live_bookings}
- Monthly Collection: ₹${t.monthly_collection} Cr
- Total Collection Till Date: ₹${t.collection_till_date} Cr
- Total Demand Raised: ₹${t.demand_raised} Cr
- Outstanding: ₹${t.outstanding} Cr
- Pending Registrations: ${t.pending_reg} (${t.pending_reg_45d} pending >45 days)
- Monthly Registrations Done: ${t.monthly_registrations}

Project wise data:
${d.projects.map(p => `${p.name}: Live=${p.live_bookings}, Monthly Collection=₹${p.monthly_collection}Cr, Outstanding=₹${p.outstanding}Cr, Pending Reg=${p.pending_reg}`).join("\n")}

Project Target vs Achievement:
${d.project_tva.map(p => `${p.name}: Target=₹${p.target}Cr, Achievement=₹${p.achievement}Cr (${p.achievement_pct}%), Forecast=₹${p.forecast}Cr`).join("\n")}

Category-wise targets:
${d.category_tva.map(c => `${c.category}: Target=₹${c.target}Cr, Achievement=₹${c.achievement}Cr`).join("\n")}

Be concise, insightful, and actionable. Use ₹ and Cr notation for amounts.`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) { setShowApiInput(true); return; }
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = messages.slice(1).map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] }));
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system_instruction: { parts: [{ text: buildContext() }] }, contents: [...history, { role: "user", parts: [{ text: input }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: `Error: ${err.message}` }]);
    }
    setLoading(false);
  };

  const saveKey = () => { sessionStorage.setItem("gemini_api_key", apiKey); setShowApiInput(false); };

  if (!open) return null;

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, width: 380, height: 580, background: "var(--bg-card)", border: "1px solid var(--border-accent)", borderRadius: 16, display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.6)", zIndex: 1000, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bot size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>CRM AI Assistant</div>
          <div style={{ fontSize: 11, color: "var(--accent-green)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", display: "inline-block" }} /> Powered by Gemini
          </div>
        </div>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}><X size={16} /></button>
      </div>

      {showApiInput && (
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)", background: "rgba(79,179,255,0.05)" }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Enter your Gemini API key (free at ai.google.dev)</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIza..."
              style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", color: "var(--text-primary)", fontSize: 12, outline: "none", fontFamily: "var(--font-body)" }} />
            <button onClick={saveKey} style={{ background: "var(--accent-blue)", border: "none", borderRadius: 6, padding: "6px 12px", color: "#000", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Save</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", background: m.role === "user" ? "linear-gradient(135deg, var(--accent-blue), #2563eb)" : "var(--bg-secondary)", border: m.role === "user" ? "none" : "1px solid var(--border)", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "10px 13px", fontSize: 13, lineHeight: 1.6, color: m.role === "user" ? "#fff" : "var(--text-primary)", whiteSpace: "pre-wrap" }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 6, padding: "10px 13px", background: "var(--bg-secondary)", borderRadius: "12px 12px 12px 2px", width: "fit-content", border: "1px solid var(--border)" }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-blue)", animation: `pulse-glow 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "0 16px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["Top performer?", "Outstanding risk", "Reg. status", "Monthly trend"].map(s => (
          <button key={s} onClick={() => setInput(s)} style={{ fontSize: 11, padding: "4px 10px", background: "rgba(79,179,255,0.1)", border: "1px solid rgba(79,179,255,0.2)", borderRadius: 20, color: "var(--accent-blue)", cursor: "pointer", fontFamily: "var(--font-body)" }}>{s}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Ask about collections, projects..."
          style={{ flex: 1, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "var(--font-body)" }}
          onFocus={e => e.target.style.borderColor = "var(--accent-blue)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"} />
        <button onClick={sendMessage} style={{ width: 40, height: 40, background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))", border: "none", borderRadius: 10, color: "#000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(() => {
    try {
      const s = sessionStorage.getItem("crm_auth");
      if (!s) return false;
      const { ts } = JSON.parse(s);
      // Session expires after 8 hours
      return (Date.now() - ts) < 8 * 60 * 60 * 1000;
    } catch { return false; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("crm_auth") || "{}").user || ""; } catch { return ""; }
  });

  const [selectedMonth, setSelectedMonth] = useState(monthKeys[monthKeys.length - 1]);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const data = monthsData[selectedMonth];
  const total = data.total;
  const monthIdx = monthKeys.indexOf(selectedMonth);
  const prevData = monthIdx > 0 ? monthsData[monthKeys[monthIdx - 1]] : null;
  const collectionTrend = prevData ? ((data.total.monthly_collection - prevData.total.monthly_collection) / prevData.total.monthly_collection) * 100 : null;
  const outstandingTrend = prevData ? ((data.total.outstanding - prevData.total.outstanding) / prevData.total.outstanding) * 100 : null;

  const handleLogout = () => {
    sessionStorage.removeItem("crm_auth");
    sessionStorage.removeItem("gemini_api_key");
    setAuthed(false);
    setCurrentUser("");
  };

  if (!authed) return <LoginScreen onLogin={u => { setCurrentUser(u); setAuthed(true); }} />;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "projects", label: "Projects", icon: Building2 },
    { id: "targets", label: "Target vs Achievement", icon: Layers },
    { id: "trends", label: "Trends", icon: TrendingUp },
    { id: "rm", label: "RM Performance", icon: Users },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Header */}
      <header style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", height: 60, gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={16} color="#000" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, letterSpacing: "0.04em" }}>RAGHAV REALTY</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em" }}>CRM COMMAND CENTER</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 2, marginLeft: 24 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ background: activeTab === t.id ? "rgba(79,179,255,0.12)" : "none", border: "none", borderRadius: 8, padding: "6px 14px", color: activeTab === t.id ? "var(--accent-blue)" : "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400, transition: "all 0.15s", fontFamily: "var(--font-body)" }}>
                <t.icon size={14} />{t.label}
              </button>
            ))}
          </nav>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-accent)", borderRadius: 8, padding: "8px 36px 8px 14px", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none", appearance: "none", fontFamily: "var(--font-display)" }}>
                {monthKeys.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none" }} />
            </div>

            {/* User badge + logout */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px" }}>
              <Lock size={12} color="var(--accent-green)" />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{currentUser}</span>
              <button onClick={handleLogout} title="Sign Out" style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0 0 0 4px", display: "flex", alignItems: "center" }}>
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 8 }}>
              <KpiCard label="CRM Achievement" value={cr(data.crm_achievement)} sub={`Target: ${cr(data.crm_target)} · ${pct(data.crm_pct)}`} color={pctColor(data.crm_pct)} icon={IndianRupee} trend={collectionTrend} />
              <KpiCard label="Monthly Collection" value={cr(total.monthly_collection)} sub={`Daily: ${cr(total.daily_collection)}`} icon={TrendingUp} trend={collectionTrend} />
              <KpiCard label="Total Outstanding" value={cr(total.outstanding)} sub={`${total.pending_reg} pending registrations`} color="var(--accent-amber)" icon={AlertCircle} trend={outstandingTrend} />
              <KpiCard label="Live Bookings" value={total.live_bookings.toLocaleString()} sub={`${total.monthly_registrations} registered this month`} icon={Building2} />
              <KpiCard label="Demand Raised" value={cr(total.demand_raised)} sub={`Collected: ${cr(total.collection_till_date)}`} color="var(--accent-cyan)" icon={FileCheck} />
              <KpiCard label="Pending >45 Days" value={total.pending_reg_45d} sub={`of ${total.pending_reg} total pending`} color={total.pending_reg_45d > 20 ? "var(--accent-red)" : "var(--accent-amber)"} icon={AlertCircle} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginTop: 16 }}>
              {/* Gauge */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>CRM Target Achievement</div>
                <div style={{ position: "relative", width: 180, height: 180 }}>
                  <svg viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={90} cy={90} r={70} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={14} />
                    <circle cx={90} cy={90} r={70} fill="none" stroke={pctColor(data.crm_pct)} strokeWidth={14} strokeLinecap="round"
                      strokeDasharray={`${2*Math.PI*70}`} strokeDashoffset={`${2*Math.PI*70*(1-data.crm_pct/100)}`} style={{ transition: "stroke-dashoffset 1s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-display)", color: pctColor(data.crm_pct) }}>{data.crm_pct}%</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Achieved</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 24, marginTop: 16, fontSize: 12 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "var(--text-muted)" }}>Target</div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>₹{data.crm_target} Cr</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "var(--text-muted)" }}>Achieved</div>
                    <div style={{ fontWeight: 700, color: pctColor(data.crm_pct) }}>₹{data.crm_achievement} Cr</div>
                  </div>
                </div>
              </div>

              {/* Collection by project */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Monthly Collection by Project (₹ Cr)</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.projects} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} tickFormatter={v => v.replace("RAGHAV ", "")} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="monthly_collection" name="Collection" radius={[4,4,0,0]}>
                      {data.projects.map((p, i) => <Cell key={i} fill={projectColors[p.name] || "var(--accent-blue)"} fillOpacity={0.85} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <SectionTitle icon={AlertCircle}>Outstanding & Pending Registrations</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Outstanding Amount by Project (₹ Cr)</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data.projects.filter(p => p.outstanding > 0)} layout="vertical" barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} tickFormatter={v => v.replace("RAGHAV ", "")} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="outstanding" name="Outstanding" fill="var(--accent-amber)" radius={[0,4,4,0]} fillOpacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Pending Registrations by Project</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                  {data.projects.filter(p => p.pending_reg > 0).map(p => (
                    <div key={p.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                        <span style={{ color: "var(--text-secondary)" }}>{p.name.replace("RAGHAV ", "")}</span>
                        <span style={{ fontWeight: 600 }}>{p.pending_reg} <span style={{ color: "var(--accent-red)", fontSize: 11 }}>({p.pending_reg_45d} &gt;45d)</span></span>
                      </div>
                      <ProgressBar value={p.pending_reg} max={total.pending_reg} color={p.pending_reg_45d > 5 ? "var(--accent-red)" : "var(--accent-amber)"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── PROJECTS ── */}
        {activeTab === "projects" && (
          <>
            <SectionTitle icon={Building2}>Project-wise Performance Matrix</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--bg-card)" }}>
                    {["Project","Live Bookings","Monthly Collection","Demand Raised","Collected Till Date","Outstanding","Pending Reg",">45 Days","Reg Targets","Daily Collection"].map(h => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: h==="Project"?"left":"right", color: "var(--text-muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", border: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...data.projects, { ...data.total, name: "TOTAL", _isTotal: true }].map((p, i) => (
                    <tr key={p.name} style={{ background: p._isTotal ? "rgba(79,179,255,0.05)" : i%2===0?"transparent":"rgba(255,255,255,0.015)", transition: "background 0.15s" }}
                      onMouseEnter={e => !p._isTotal && (e.currentTarget.style.background = "var(--bg-card-hover)")}
                      onMouseLeave={e => !p._isTotal && (e.currentTarget.style.background = i%2===0?"transparent":"rgba(255,255,255,0.015)")}>
                      <td style={{ padding: "12px 14px", border: "1px solid var(--border)", fontWeight: p._isTotal?700:500, color: p._isTotal?"var(--accent-blue)":"var(--text-primary)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {!p._isTotal && <span style={{ width: 8, height: 8, borderRadius: "50%", background: projectColors[p.name]||"var(--accent-blue)", display: "inline-block", flexShrink: 0 }} />}
                          {p.name}
                        </div>
                      </td>
                      {[p.live_bookings, cr(p.monthly_collection), cr(p.demand_raised), cr(p.collection_till_date), cr(p.outstanding), p.pending_reg, p.pending_reg_45d, p.reg_targets, cr(p.daily_collection)].map((v,j) => (
                        <td key={j} style={{ padding: "12px 14px", textAlign: "right", border: "1px solid var(--border)", fontWeight: p._isTotal?700:400, color: p._isTotal?"var(--accent-blue)":"var(--text-primary)" }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SectionTitle icon={TrendingUp}>Collection Efficiency (Collected / Demand Raised)</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {data.projects.map(p => {
                const eff = p.demand_raised > 0 ? (p.collection_till_date / p.demand_raised) * 100 : 0;
                return (
                  <div key={p.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: projectColors[p.name], display: "inline-block" }} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{p.name.replace("RAGHAV ", "")}</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: pctColor(eff), marginBottom: 8 }}>{pct(eff)}</div>
                    <ProgressBar value={p.collection_till_date} max={p.demand_raised} color={pctColor(eff)} />
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>{cr(p.collection_till_date)} / {cr(p.demand_raised)}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── TARGET vs ACHIEVEMENT ── */}
        {activeTab === "targets" && (
          <>
            <SectionTitle icon={Layers}>Project-wise: Target, Forecast & Achievement</SectionTitle>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data.project_tva.filter(p => p.target > 0 || p.achievement > 0)} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Times New Roman" }} />
                  {/* Order: Target → Forecast → Achievement */}
                  <Bar dataKey="target"      name="Target"      fill="rgba(79,179,255,0.3)"  stroke="var(--accent-blue)"  strokeWidth={1} radius={[4,4,0,0]} />
                  <Bar dataKey="forecast"    name="Forecast"    fill="var(--accent-amber)"    fillOpacity={0.75}            radius={[4,4,0,0]} />
                  <Bar dataKey="achievement" name="Achievement" fill="var(--accent-green)"    fillOpacity={0.85}            radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 20 }}>
              {data.project_tva.filter(p => p.target > 0).map(p => (
                <div key={p.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: pctColor(p.achievement_pct), marginBottom: 8 }}>{pct(p.achievement_pct)}</div>
                  <ProgressBar value={p.achievement} max={p.target} color={pctColor(p.achievement_pct)} />
                  <div style={{ fontSize: 11, marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ color: "var(--accent-blue)" }}>Target: {cr(p.target)}</span>
                    <span style={{ color: "var(--accent-amber)" }}>Forecast: {cr(p.forecast)}</span>
                    <span style={{ color: "var(--accent-green)" }}>Achievement: {cr(p.achievement)}</span>
                  </div>
                </div>
              ))}
            </div>

            <SectionTitle icon={Layers}>Category-wise: Target, Forecast & Achievement</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.category_tva} layout="vertical" barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <YAxis dataKey="category" type="category" width={160} tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Times New Roman" }} />
                    <Bar dataKey="target"      name="Target"      fill="rgba(79,179,255,0.3)" stroke="var(--accent-blue)" strokeWidth={1} radius={[0,4,4,0]} />
                    <Bar dataKey="achievement" name="Achievement" fill="var(--accent-green)"  fillOpacity={0.8}            radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.category_tva.map(c => (
                  <div key={c.category} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{c.category}</div>
                    <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ color: "var(--accent-blue)" }}>T: <strong>{cr(c.target)}</strong></span>
                      <span style={{ color: pctColor(c.achievement_pct) }}>A: <strong>{cr(c.achievement)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── TRENDS ── */}
        {activeTab === "trends" && (
          <>
            <SectionTitle icon={TrendingUp}>3-Month Performance Trend</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Target, Forecast & Achievement (₹ Cr)</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gradAchv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Times New Roman" }} />
                    <Area type="monotone" dataKey="target"      name="Target"      stroke="var(--accent-blue)"  fill="url(#gradTarget)" strokeWidth={2} dot={{ r: 4 }} />
                    <Area type="monotone" dataKey="achievement" name="Achievement" stroke="var(--accent-green)" fill="url(#gradAchv)"   strokeWidth={2} dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Monthly Collection & Outstanding (₹ Cr)</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Times New Roman" }} />
                    <Line type="monotone" dataKey="monthly_collection" name="Monthly Collection" stroke="var(--accent-cyan)"  strokeWidth={2} dot={{ r: 5, fill: "var(--accent-cyan)" }} />
                    <Line type="monotone" dataKey="outstanding"        name="Outstanding"        stroke="var(--accent-amber)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 5, fill: "var(--accent-amber)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Live Bookings & Pending Registrations</div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Times New Roman" }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "Times New Roman" }} />
                    <Line type="monotone" dataKey="live_bookings" name="Live Bookings"  stroke="var(--accent-purple)" strokeWidth={2} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="pending_reg"   name="Pending Reg."   stroke="var(--accent-red)"    strokeWidth={2} strokeDasharray="4 3" dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>Month Summary Comparison</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {trendData.map(d => (
                    <div key={d.month}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{d.month}</span>
                        <span style={{ color: pctColor(d.pct) }}>{d.pct}% of target achieved</span>
                      </div>
                      <ProgressBar value={d.pct} max={100} color={pctColor(d.pct)} />
                      <div style={{ display: "flex", gap: 16, marginTop: 4, fontSize: 11, color: "var(--text-muted)" }}>
                        <span style={{ color: "var(--accent-blue)" }}>Target: ₹{d.target} Cr</span>
                        <span style={{ color: "var(--accent-green)" }}>Achieved: ₹{d.achievement} Cr</span>
                        <span>Collected: ₹{d.monthly_collection} Cr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── RM PERFORMANCE ── */}
        {activeTab === "rm" && <RMPerformanceTab data={data} monthKey={selectedMonth} />}
      </main>

      {/* AI Chat Button */}
      <button onClick={() => setChatOpen(!chatOpen)}
        style={{ position: "fixed", right: 24, bottom: 24, width: 52, height: 52, borderRadius: "50%", background: chatOpen ? "var(--bg-card)" : "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))", border: "1px solid var(--border-accent)", boxShadow: "0 8px 32px rgba(79,179,255,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", zIndex: chatOpen ? 999 : 1001 }}>
        {chatOpen ? <X size={20} color="var(--text-secondary)" /> : <MessageSquare size={22} color="#000" />}
      </button>

      <AIChatPanel open={chatOpen} onClose={() => setChatOpen(false)} currentData={data} monthKey={selectedMonth} />
    </div>
  );
}
