"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasks: number;
  completed: number;
  color: string;
  bg: string;
  gradient: string;
  icon: string;
  members: { initials: string; color: string; bg: string }[];
  dueDate: string;
}

interface Task {
  id: string;
  title: string;
  project: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  overdue?: boolean;
  assignee: { initials: string; color: string; bg: string };
  tags: { label: string; color: string; bg: string }[];
  done: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: "nexus",
    name: "Nexus App",
    description: "Full-stack SaaS workspace platform",
    progress: 72, tasks: 45, completed: 32,
    color: "#6c5ce7", bg: "#f0eeff",
    gradient: "linear-gradient(135deg,#6c5ce7,#e84393)",
    icon: "🚀",
    members: [
      { initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" },
      { initials: "JM", color: "#00b894", bg: "#e0fff6" },
      { initials: "SR", color: "#e84393", bg: "#ffeaf5" },
    ],
    dueDate: "Mar 31, 2026",
  },
  {
    id: "marketing",
    name: "Marketing Site",
    description: "Landing page redesign & SEO",
    progress: 45, tasks: 28, completed: 12,
    color: "#e84393", bg: "#ffeaf5",
    gradient: "linear-gradient(135deg,#e84393,#e17055)",
    icon: "📣",
    members: [
      { initials: "SR", color: "#e84393", bg: "#ffeaf5" },
      { initials: "KP", color: "#0099cc", bg: "#e0f5ff" },
    ],
    dueDate: "Apr 15, 2026",
  },
  {
    id: "design",
    name: "Design System",
    description: "Component library & style guide",
    progress: 88, tasks: 32, completed: 28,
    color: "#00b894", bg: "#e0fff6",
    gradient: "linear-gradient(135deg,#00b894,#0099cc)",
    icon: "🎨",
    members: [
      { initials: "SR", color: "#e84393", bg: "#ffeaf5" },
      { initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" },
    ],
    dueDate: "Mar 20, 2026",
  },
  {
    id: "api",
    name: "API v2",
    description: "REST & GraphQL backend upgrade",
    progress: 30, tasks: 19, completed: 5,
    color: "#0099cc", bg: "#e0f5ff",
    gradient: "linear-gradient(135deg,#0099cc,#6c5ce7)",
    icon: "⚙️",
    members: [
      { initials: "JM", color: "#00b894", bg: "#e0fff6" },
      { initials: "KP", color: "#0099cc", bg: "#e0f5ff" },
    ],
    dueDate: "May 1, 2026",
  },
];

const RECENT_TASKS: Task[] = [
  {
    id: "t1", title: "Design new onboarding flow", project: "Nexus App",
    priority: "high", dueDate: "Mar 20", overdue: false,
    assignee: { initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" },
    tags: [{ label: "Design", color: "#6c5ce7", bg: "#f0eeff" }], done: false,
  },
  {
    id: "t2", title: "Build dashboard UI components", project: "Nexus App",
    priority: "high", dueDate: "Mar 15", overdue: true,
    assignee: { initials: "AJ", color: "#6c5ce7", bg: "#f0eeff" },
    tags: [{ label: "Frontend", color: "#6c5ce7", bg: "#f0eeff" }], done: false,
  },
  {
    id: "t3", title: "Auth module code review", project: "Nexus App",
    priority: "medium", dueDate: "Mar 18",
    assignee: { initials: "SR", color: "#e84393", bg: "#ffeaf5" },
    tags: [{ label: "Review", color: "#e17055", bg: "#fff0eb" }], done: false,
  },
  {
    id: "t4", title: "Landing page redesign", project: "Marketing Site",
    priority: "high", dueDate: "Mar 22",
    assignee: { initials: "SR", color: "#e84393", bg: "#ffeaf5" },
    tags: [{ label: "Design", color: "#6c5ce7", bg: "#f0eeff" }], done: false,
  },
  {
    id: "t5", title: "Setup CI/CD pipeline", project: "API v2",
    priority: "medium", dueDate: "Mar 25",
    assignee: { initials: "JM", color: "#00b894", bg: "#e0fff6" },
    tags: [{ label: "DevOps", color: "#00b894", bg: "#e0fff6" }], done: true,
  },
  {
    id: "t6", title: "Color token documentation", project: "Design System",
    priority: "low", dueDate: "Mar 28",
    assignee: { initials: "SR", color: "#e84393", bg: "#ffeaf5" },
    tags: [{ label: "Docs", color: "#e84393", bg: "#ffeaf5" }], done: false,
  },
];

const UPCOMING = [
  { title: "Design System deadline",    date: "Mar 20", daysLeft: 6,  color: "#00b894", urgent: false },
  { title: "Sprint review meeting",     date: "Mar 17", daysLeft: 3,  color: "#e84393", urgent: true  },
  { title: "Nexus App v1 launch",       date: "Mar 31", daysLeft: 17, color: "#6c5ce7", urgent: false },
  { title: "API v2 planning session",   date: "Mar 19", daysLeft: 5,  color: "#0099cc", urgent: false },
  { title: "Marketing site go-live",    date: "Apr 15", daysLeft: 32, color: "#e17055", urgent: false },
];

const STATS = [
  { label: "Total Tasks",  value: "124", icon: "📋", color: "#6c5ce7", bg: "#f0eeff",  change: "+12" },
  { label: "Completed",    value: "89",  icon: "✅", color: "#00b894", bg: "#e0fff6",  change: "+8"  },
  { label: "In Progress",  value: "23",  icon: "⚡", color: "#0099cc", bg: "#e0f5ff",  change: "-3"  },
  { label: "Overdue",      value: "12",  icon: "⚠️", color: "#e17055", bg: "#fff0eb", change: "+2"  },
];

// ─── Priority Badge ───────────────────────────────────────────────────────────

const PriorityBadge = ({ priority }: { priority: "high" | "medium" | "low" }) => {
  if (priority === "high")
    return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 600, background: "linear-gradient(135deg,#fff0f5,#ffd6eb)", color: "#e84393", border: "1px solid rgba(232,67,147,0.2)" }}>⚡ High</span>;
  if (priority === "medium")
    return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 600, background: "#f2f2f2", color: "#1a1a1a", border: "1px solid rgba(0,0,0,0.1)" }}>🔺 Medium</span>;
  return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 600, background: "linear-gradient(135deg,#f0fff8,#c8fff0)", color: "#007a56", border: "1px solid rgba(0,184,148,0.2)" }}>● Low</span>;
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(RECENT_TASKS);

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  const completedCount = tasks.filter((t) => t.done).length;
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f8f6ff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 4px; }
        .project-card:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 40px rgba(108,92,231,0.15) !important; }
        .task-row:hover { background: #f8f6ff !important; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(180deg,#6c5ce7 0%,#e84393 60%,#0099cc 100%)", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: 4, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: "1.5rem", padding: "0 0.5rem", position: "relative", zIndex: 1 }}>Nexus</div>
          {[
            { icon: "🏠", label: "Home",      badge: null, active: true,  href: "/"          },
            { icon: "▦",  label: "Dashboard", badge: null, active: false, href: "/dashboard" },
            { icon: "☰",  label: "Tasks",     badge: "12", active: false, href: "/dashboard" },
            { icon: "💬", label: "Chat",      badge: "3",  active: false, href: "/chat"      },
            { icon: "📄", label: "Docs",      badge: null, active: false, href: "#"          },
            { icon: "📊", label: "Analytics", badge: null, active: false, href: "/analytics" },
          ].map(({ icon, label, badge, active, href }) => (
            <a key={label} href={href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.7)", cursor: "pointer", background: active ? "rgba(255,255,255,0.15)" : "transparent", fontWeight: active ? 500 : 400, position: "relative", zIndex: 1 }}>
              <span>{icon}</span>{label}
              {badge && <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 100, fontWeight: 600 }}>{badge}</span>}
            </a>
          ))}
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 0.5rem", margin: "1rem 0 0.5rem", position: "relative", zIndex: 1 }}>Projects</div>
          {PROJECTS.map(({ id, name, color }) => (
            <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,0.6)", cursor: "pointer", position: "relative", zIndex: 1 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />{name}
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", border: "2px solid rgba(255,255,255,0.3)" }}>AJ</div>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>Ajith M.</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Owner</div></div>
          </div>
        </div>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <div style={{ overflowY: "auto", background: "#f8f6ff" }}>

          {/* Hero greeting banner */}
          <div style={{
            background: "linear-gradient(135deg,#6c5ce7 0%,#e84393 50%,#0099cc 100%)",
            padding: "2rem 2rem 1.75rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: -40, left: 200, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>
                {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
                {greeting}, Ajith! 👋
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 300 }}>
                You have <strong style={{ color: "#fff" }}>{tasks.filter((t) => !t.done).length} tasks</strong> pending and <strong style={{ color: "#fff" }}>{UPCOMING.filter((u) => u.urgent).length} urgent deadline</strong> coming up.
              </div>
            </div>
            {/* Quick actions */}
            <div style={{ display: "flex", gap: 8, marginTop: "1.25rem", position: "relative", zIndex: 1 }}>
              {[
                { label: "➕ New Task",    href: "/dashboard" },
                { label: "💬 Open Chat",   href: "/chat"      },
                { label: "📊 Analytics",   href: "/analytics" },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ textDecoration: "none", padding: "7px 16px", borderRadius: 8, background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 500, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all .2s" }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* ── Stat cards ─────────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
              {STATS.map((s) => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "1.1rem 1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>{s.label}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: s.change.startsWith("+") ? (s.label === "Overdue" ? "#e17055" : "#00b894") : "#0099cc", background: s.change.startsWith("+") ? (s.label === "Overdue" ? "#fff0eb" : "#e0fff6") : "#e0f5ff", padding: "2px 7px", borderRadius: 100 }}>
                    {s.change}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Project cards ───────────────────────────────────────────── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: "#0a0814" }}>Projects</div>
                <a href="/dashboard" style={{ fontSize: 12, color: "#6c5ce7", fontWeight: 600, textDecoration: "none" }}>View all →</a>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
                {PROJECTS.map((p) => (
                  <div
                    key={p.id}
                    className="project-card"
                    style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1.5px solid rgba(108,92,231,0.07)", cursor: "pointer", transition: "all .25s" }}
                  >
                    {/* Card top gradient */}
                    <div style={{ background: p.gradient, padding: "1.1rem 1.1rem 1rem", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -30, right: -30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                      <div style={{ fontSize: 26, marginBottom: 6, position: "relative", zIndex: 1 }}>{p.icon}</div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: "#fff", position: "relative", zIndex: 1 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 300, position: "relative", zIndex: 1, marginTop: 2 }}>{p.description}</div>
                    </div>
                    {/* Card body */}
                    <div style={{ padding: "1rem 1.1rem" }}>
                      {/* Progress */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "#aaa" }}>Progress</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.progress}%</span>
                      </div>
                      <div style={{ background: p.bg, borderRadius: 4, height: 6, overflow: "hidden", marginBottom: "1rem" }}>
                        <div style={{ height: "100%", borderRadius: 4, background: p.color, width: `${p.progress}%`, transition: "width .5s" }} />
                      </div>
                      {/* Footer */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex" }}>
                          {p.members.map((m, i) => (
                            <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, border: "2px solid #fff", marginLeft: i === 0 ? 0 : -7 }}>{m.initials}</div>
                          ))}
                        </div>
                        <span style={{ fontSize: 10, color: "#aaa" }}>📅 {p.dueDate}</span>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 10, color: "#bbb" }}>{p.completed}/{p.tasks} tasks done</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recent tasks + Upcoming ──────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem" }}>

              {/* Recent tasks */}
              <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(108,92,231,0.06)" }}>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814" }}>Recent Tasks</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{completedCount}/{tasks.length} completed today</div>
                  </div>
                  <a href="/dashboard" style={{ fontSize: 12, color: "#6c5ce7", fontWeight: 600, textDecoration: "none", padding: "5px 12px", borderRadius: 8, background: "#f0eeff", border: "1.5px solid rgba(108,92,231,0.12)" }}>View board →</a>
                </div>
                <div>
                  {tasks.map((task, i) => (
                    <div
                      key={task.id}
                      className="task-row"
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 1.5rem",
                        borderBottom: i < tasks.length - 1 ? "1px solid rgba(108,92,231,0.04)" : "none",
                        transition: "background .15s", cursor: "pointer",
                        opacity: task.done ? 0.5 : 1,
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={() => toggleTask(task.id)}
                        style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                          border: task.done ? "none" : "2px solid rgba(108,92,231,0.25)",
                          background: task.done ? "linear-gradient(135deg,#6c5ce7,#e84393)" : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all .2s",
                        }}
                      >
                        {task.done && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#0a0814", textDecoration: task.done ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                          <span style={{ fontSize: 10, color: "#aaa" }}>{task.project}</span>
                          {task.tags.map((tag) => (
                            <span key={tag.label} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 100, background: tag.bg, color: tag.color, fontWeight: 600 }}>{tag.label}</span>
                          ))}
                        </div>
                      </div>

                      {/* Priority */}
                      <PriorityBadge priority={task.priority} />

                      {/* Due date */}
                      <span style={{ fontSize: 10, color: task.overdue ? "#e84393" : "#aaa", fontWeight: task.overdue ? 600 : 400, whiteSpace: "nowrap" }}>
                        {task.overdue ? "⚠️ " : "📅 "}{task.dueDate}
                      </span>

                      {/* Assignee */}
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: task.assignee.bg, color: task.assignee.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, flexShrink: 0 }}>
                        {task.assignee.initials}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming due dates */}
              <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.06)", overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: "1px solid rgba(108,92,231,0.06)" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814" }}>Upcoming Deadlines</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{UPCOMING.filter((u) => u.urgent).length} urgent this week</div>
                </div>
                <div style={{ padding: "0.5rem 0" }}>
                  {UPCOMING.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 1.25rem", borderBottom: i < UPCOMING.length - 1 ? "1px solid rgba(108,92,231,0.04)" : "none" }}>
                      {/* Days left badge */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: item.urgent ? "linear-gradient(135deg,#fff0f5,#ffd6eb)" : `${item.color}15`,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        border: item.urgent ? "1.5px solid rgba(232,67,147,0.2)" : `1.5px solid ${item.color}22`,
                      }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: item.urgent ? "#e84393" : item.color, lineHeight: 1 }}>{item.daysLeft}</span>
                        <span style={{ fontSize: 8, color: item.urgent ? "#e84393" : item.color, fontWeight: 500 }}>days</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#0a0814", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                        <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>📅 {item.date}</div>
                      </div>
                      {item.urgent && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#e84393", background: "#ffeaf5", padding: "2px 7px", borderRadius: 100, flexShrink: 0 }}>Urgent</span>
                      )}
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
