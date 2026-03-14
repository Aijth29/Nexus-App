"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  color: string;
  bg: string;
}

interface ActivityItem {
  id: string;
  user: string;
  userInitials: string;
  userColor: string;
  userBg: string;
  action: string;
  target: string;
  time: string;
  icon: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  { label: "Total Tasks",       value: "124",  change: "+12 this week", positive: true,  icon: "📋", color: "#6c5ce7", bg: "#f0eeff" },
  { label: "Completed",         value: "89",   change: "+8 this week",  positive: true,  icon: "✅", color: "#00b894", bg: "#e0fff6" },
  { label: "In Progress",       value: "23",   change: "-3 this week",  positive: false, icon: "⚡", color: "#0099cc", bg: "#e0f5ff" },
  { label: "Overdue",           value: "12",   change: "+2 this week",  positive: false, icon: "⚠️", color: "#e17055", bg: "#fff0eb" },
];

const WEEKLY_TASKS = [
  { day: "Mon", completed: 8,  added: 5  },
  { day: "Tue", completed: 12, added: 9  },
  { day: "Wed", completed: 6,  added: 11 },
  { day: "Thu", completed: 15, added: 7  },
  { day: "Fri", completed: 10, added: 13 },
  { day: "Sat", completed: 4,  added: 2  },
  { day: "Sun", completed: 2,  added: 1  },
];

const MONTHLY_TREND = [
  { month: "Oct", tasks: 45 },
  { month: "Nov", tasks: 62 },
  { month: "Dec", tasks: 38 },
  { month: "Jan", tasks: 78 },
  { month: "Feb", tasks: 95 },
  { month: "Mar", tasks: 124 },
];

const PROJECTS = [
  { name: "Nexus App",     progress: 72, tasks: 45, color: "#6c5ce7", bg: "#f0eeff" },
  { name: "Marketing",     progress: 45, tasks: 28, color: "#e84393", bg: "#ffeaf5" },
  { name: "Design System", progress: 88, tasks: 32, color: "#00b894", bg: "#e0fff6" },
  { name: "API v2",        progress: 30, tasks: 19, color: "#0099cc", bg: "#e0f5ff" },
];

const TASK_STATUS = [
  { label: "Done",        value: 89,  color: "#00b894", pct: 72 },
  { label: "In Progress", value: 23,  color: "#0099cc", pct: 18 },
  { label: "Review",      value: 12,  color: "#e17055", pct: 10 },
];

const TEAM_PERFORMANCE = [
  { name: "Ajith M.",  initials: "AJ", color: "#6c5ce7", bg: "#f0eeff", completed: 38, inProgress: 5, total: 45 },
  { name: "John M.",   initials: "JM", color: "#00b894", bg: "#e0fff6", completed: 27, inProgress: 8, total: 35 },
  { name: "Sarah R.",  initials: "SR", color: "#e84393", bg: "#ffeaf5", completed: 19, inProgress: 6, total: 28 },
  { name: "Kiran P.",  initials: "KP", color: "#0099cc", bg: "#e0f5ff", completed: 5,  inProgress: 4, total: 16 },
];

const ACTIVITY: ActivityItem[] = [
  { id: "a1", user: "Ajith M.",  userInitials: "AJ", userColor: "#6c5ce7", userBg: "#f0eeff", action: "completed",  target: "Deploy to Vercel",            time: "2 min ago",  icon: "✅" },
  { id: "a2", user: "Sarah R.",  userInitials: "SR", userColor: "#e84393", userBg: "#ffeaf5", action: "created",    target: "Design new onboarding flow",  time: "18 min ago", icon: "➕" },
  { id: "a3", user: "John M.",   userInitials: "JM", userColor: "#00b894", userBg: "#e0fff6", action: "moved",      target: "API integration to Review",   time: "45 min ago", icon: "↗️" },
  { id: "a4", user: "Kiran P.",  userInitials: "KP", userColor: "#0099cc", userBg: "#e0f5ff", action: "commented on","target": "Auth module code review",  time: "1 hr ago",   icon: "💬" },
  { id: "a5", user: "Ajith M.",  userInitials: "AJ", userColor: "#6c5ce7", userBg: "#f0eeff", action: "completed",  target: "Setup Neon PostgreSQL",       time: "2 hrs ago",  icon: "✅" },
  { id: "a6", user: "Sarah R.",  userInitials: "SR", userColor: "#e84393", userBg: "#ffeaf5", action: "uploaded",   target: "Design assets to Docs",       time: "3 hrs ago",  icon: "📎" },
  { id: "a7", user: "John M.",   userInitials: "JM", userColor: "#00b894", userBg: "#e0fff6", action: "completed",  target: "Set up CI/CD pipeline",       time: "5 hrs ago",  icon: "✅" },
];

// ─── Mini bar chart ───────────────────────────────────────────────────────────

const BarChart = ({ data, height = 120 }: { data: typeof WEEKLY_TASKS; height?: number }) => {
  const max = Math.max(...data.flatMap((d) => [d.completed, d.added]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 2, width: "100%" }}>
            <div
              style={{
                flex: 1, borderRadius: "4px 4px 0 0",
                height: `${(d.completed / max) * 100}%`,
                background: "linear-gradient(180deg,#6c5ce7,#e84393)",
                minHeight: 4, transition: "height .3s ease",
              }}
              title={`Completed: ${d.completed}`}
            />
            <div
              style={{
                flex: 1, borderRadius: "4px 4px 0 0",
                height: `${(d.added / max) * 100}%`,
                background: "linear-gradient(180deg,#0099cc,#00b894)",
                minHeight: 4, transition: "height .3s ease", opacity: 0.7,
              }}
              title={`Added: ${d.added}`}
            />
          </div>
          <span style={{ fontSize: 10, color: "#bbb", fontWeight: 500 }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Line chart ───────────────────────────────────────────────────────────────

const LineChart = ({ data }: { data: typeof MONTHLY_TREND }) => {
  const max    = Math.max(...data.map((d) => d.tasks));
  const min    = Math.min(...data.map((d) => d.tasks));
  const w      = 100 / (data.length - 1);
  const points = data.map((d, i) => ({
    x: i * w,
    y: 100 - ((d.tasks - min) / (max - min)) * 80 - 10,
  }));
  const pathD  = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD  = `${pathD} L ${points[points.length - 1].x} 100 L 0 100 Z`;

  return (
    <div style={{ position: "relative", height: 120 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6c5ce7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#6c5ce7" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {data.map((d) => (
          <span key={d.month} style={{ fontSize: 10, color: "#bbb", fontWeight: 500 }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
};

// ─── Donut chart ──────────────────────────────────────────────────────────────

const DonutChart = ({ data }: { data: typeof TASK_STATUS }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const radius = 36;
  const cx = 50; const cy = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg viewBox="0 0 100 100" width={110} height={110} style={{ flexShrink: 0 }}>
        {/* Background circle */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f0eeff" strokeWidth="14" />
        {data.map((d, i) => {
          const pct    = d.value / total;
          const dash   = pct * circumference;
          const gap    = circumference - dash;
          const offset = circumference - cumulative * circumference;
          cumulative  += pct;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              style={{ transition: "all .5s ease", transformOrigin: "center", transform: "rotate(-90deg)" }}
            />
          );
        })}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0a0814" fontFamily="Syne, sans-serif">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="#aaa" fontFamily="DM Sans, sans-serif">tasks</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#6b6b8a", flex: 1 }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0a0814" }}>{d.value}</span>
            <span style={{ fontSize: 10, color: "#bbb" }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");

  const completionRate = Math.round((89 / 124) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f8f6ff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 4px; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(180deg,#6c5ce7 0%,#e84393 60%,#0099cc 100%)", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: 4, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: "1.5rem", padding: "0 0.5rem", position: "relative", zIndex: 1 }}>Nexus</div>
          {[
            { icon: "▦",  label: "Dashboard", badge: null,  active: false, href: "/dashboard" },
            { icon: "☰",  label: "Tasks",     badge: "12",  active: false, href: "/dashboard" },
            { icon: "💬", label: "Chat",      badge: "3",   active: false, href: "/chat"      },
            { icon: "📄", label: "Docs",      badge: null,  active: false, href: "#"          },
            { icon: "📊", label: "Analytics", badge: null,  active: true,  href: "/analytics" },
          ].map(({ icon, label, badge, active, href }) => (
            <a key={label} href={href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.7)", cursor: "pointer", background: active ? "rgba(255,255,255,0.15)" : "transparent", fontWeight: active ? 500 : 400, position: "relative", zIndex: 1 }}>
              <span>{icon}</span>{label}
              {badge && <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 100, fontWeight: 600 }}>{badge}</span>}
            </a>
          ))}
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 0.5rem", margin: "1rem 0 0.5rem", position: "relative", zIndex: 1 }}>Projects</div>
          {[{ label: "Nexus App", active: true }, { label: "Marketing", active: false }, { label: "Design System", active: false }].map(({ label, active }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", background: active ? "rgba(255,255,255,0.15)" : "transparent", position: "relative", zIndex: 1 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "#fff" : "rgba(255,255,255,0.5)", flexShrink: 0 }} />{label}
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", border: "2px solid rgba(255,255,255,0.3)" }}>AJ</div>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>Ajith M.</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Owner</div></div>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div style={{ overflowY: "auto", background: "#f8f6ff" }}>

          {/* Topbar */}
          <div style={{ background: "#fff", borderBottom: "1px solid rgba(108,92,231,0.08)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#6c5ce7,#e84393)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analytics</div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>Nexus App • March 2026</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["week", "month", "year"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", transition: "all .2s", border: "1.5px solid rgba(108,92,231,0.12)",
                    background: period === p ? "linear-gradient(135deg,#6c5ce7,#e84393)" : "#fff",
                    color: period === p ? "#fff" : "#6b6b8a",
                    borderColor: period === p ? "transparent" : "rgba(108,92,231,0.12)",
                    boxShadow: period === p ? "0 3px 10px rgba(108,92,231,0.25)" : "none",
                  }}
                >{p.charAt(0).toUpperCase() + p.slice(1)}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* ── Stat cards ─────────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
              {STAT_CARDS.map((card) => (
                <div key={card.label} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{card.icon}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: card.positive ? "#00b894" : "#e17055", background: card.positive ? "#e0fff6" : "#fff0eb", padding: "3px 8px", borderRadius: 100 }}>
                      {card.change}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* ── Row 2: Bar chart + Donut ────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem" }}>

              {/* Weekly tasks bar chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814" }}>Weekly Task Activity</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Completed vs Added this week</div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(135deg,#6c5ce7,#e84393)" }} />
                      <span style={{ fontSize: 11, color: "#aaa" }}>Completed</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(135deg,#0099cc,#00b894)", opacity: 0.7 }} />
                      <span style={{ fontSize: 11, color: "#aaa" }}>Added</span>
                    </div>
                  </div>
                </div>
                <BarChart data={WEEKLY_TASKS} height={130} />
              </div>

              {/* Donut chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814", marginBottom: 4 }}>Task Status</div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: "1.25rem" }}>Overall breakdown</div>
                <DonutChart data={TASK_STATUS} />
                {/* Completion rate */}
                <div style={{ marginTop: "1.25rem", background: "#f8f6ff", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#6b6b8a" }}>Completion Rate</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#6c5ce7" }}>{completionRate}%</span>
                  </div>
                  <div style={{ background: "#e8e4ff", borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#6c5ce7,#e84393)", width: `${completionRate}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Row 3: Line chart + Projects ────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem" }}>

              {/* Line chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814" }}>Task Growth</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Total tasks over 6 months</div>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#6c5ce7" }}>
                    +176%
                    <span style={{ fontSize: 11, color: "#00b894", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginLeft: 4 }}>↑</span>
                  </div>
                </div>
                <LineChart data={MONTHLY_TREND} />
              </div>

              {/* Project progress */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814", marginBottom: 4 }}>Project Progress</div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: "1.25rem" }}>Completion by project</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {PROJECTS.map((p) => (
                    <div key={p.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#0a0814" }}>{p.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 10, color: "#bbb" }}>{p.tasks} tasks</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.progress}%</span>
                        </div>
                      </div>
                      <div style={{ background: p.bg, borderRadius: 4, height: 7, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 4, background: p.color, width: `${p.progress}%`, transition: "width .5s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Row 4: Team performance + Activity ──────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

              {/* Team performance */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814", marginBottom: 4 }}>Team Performance</div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: "1.25rem" }}>Tasks completed per member</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {TEAM_PERFORMANCE.map((member) => (
                    <div key={member.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: member.bg, color: member.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, border: `2px solid ${member.color}22` }}>
                        {member.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "#0a0814" }}>{member.name}</span>
                          <span style={{ fontSize: 11, color: "#aaa" }}>{member.completed}/{member.total}</span>
                        </div>
                        <div style={{ background: "#f0eeff", borderRadius: 4, height: 6, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: 4,
                            background: `linear-gradient(90deg, ${member.color}, ${member.color}aa)`,
                            width: `${(member.completed / member.total) * 100}%`,
                            transition: "width .5s ease",
                          }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: member.color, width: 36, textAlign: "right" }}>
                        {Math.round((member.completed / member.total) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity timeline */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814", marginBottom: 4 }}>Activity Timeline</div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: "1.25rem" }}>Recent team actions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {ACTIVITY.map((item, i) => (
                    <div key={item.id} style={{ display: "flex", gap: 10, position: "relative", paddingBottom: i < ACTIVITY.length - 1 ? 14 : 0 }}>
                      {/* Timeline line */}
                      {i < ACTIVITY.length - 1 && (
                        <div style={{ position: "absolute", left: 16, top: 32, bottom: 0, width: 1, background: "rgba(108,92,231,0.08)" }} />
                      )}
                      {/* Avatar */}
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: item.userBg, color: item.userColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, border: `2px solid ${item.userColor}22`, position: "relative", zIndex: 1 }}>
                        {item.userInitials}
                      </div>
                      <div style={{ flex: 1, paddingTop: 2 }}>
                        <div style={{ fontSize: 12, color: "#0a0814", lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 600 }}>{item.user}</span>
                          <span style={{ color: "#6b6b8a", fontWeight: 300 }}> {item.action} </span>
                          <span style={{ fontWeight: 500, color: "#6c5ce7" }}>{item.target}</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>{item.time}</div>
                      </div>
                      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
