"use client";

import { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = "assigned" | "completed" | "comment" | "due" | "project" | "joined";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  user?: { initials: string; color: string; bg: string };
  icon: string;
  color: string;
  bg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_NOTIFS: Notification[] = [
  {
    id: "n1", type: "assigned", read: false,
    title: "Task assigned to you",
    body: "Sarah R. assigned you \"Design new onboarding flow\"",
    time: "2 min ago", icon: "📋", color: "#6c5ce7", bg: "#f0eeff",
    user: { initials: "SR", color: "#e84393", bg: "#ffeaf5" },
  },
  {
    id: "n2", type: "comment", read: false,
    title: "New comment on your task",
    body: "John M. commented on \"Build dashboard UI components\"",
    time: "15 min ago", icon: "💬", color: "#0099cc", bg: "#e0f5ff",
    user: { initials: "JM", color: "#00b894", bg: "#e0fff6" },
  },
  {
    id: "n3", type: "due", read: false,
    title: "Due date reminder",
    body: "\"Build dashboard UI components\" is overdue by 1 day",
    time: "1 hr ago", icon: "⚠️", color: "#e84393", bg: "#ffeaf5",
  },
  {
    id: "n4", type: "completed", read: false,
    title: "Task completed",
    body: "John M. completed \"Set up CI/CD pipeline\"",
    time: "2 hrs ago", icon: "✅", color: "#00b894", bg: "#e0fff6",
    user: { initials: "JM", color: "#00b894", bg: "#e0fff6" },
  },
  {
    id: "n5", type: "joined", read: true,
    title: "Team member joined",
    body: "Kiran P. joined the Nexus App workspace",
    time: "3 hrs ago", icon: "👋", color: "#e17055", bg: "#fff0eb",
    user: { initials: "KP", color: "#0099cc", bg: "#e0f5ff" },
  },
  {
    id: "n6", type: "project", read: true,
    title: "Project update",
    body: "Design System reached 88% completion 🎉",
    time: "5 hrs ago", icon: "🏗️", color: "#6c5ce7", bg: "#f0eeff",
  },
  {
    id: "n7", type: "assigned", read: true,
    title: "Task assigned to you",
    body: "Sarah R. assigned you \"Landing page design review\"",
    time: "Yesterday", icon: "📋", color: "#6c5ce7", bg: "#f0eeff",
    user: { initials: "SR", color: "#e84393", bg: "#ffeaf5" },
  },
  {
    id: "n8", type: "due", read: true,
    title: "Due date reminder",
    body: "\"API integration for tasks\" is due tomorrow",
    time: "Yesterday", icon: "⏰", color: "#e17055", bg: "#fff0eb",
  },
];

const TYPE_FILTERS: { label: string; type: NotifType | "all" }[] = [
  { label: "All",      type: "all"       },
  { label: "📋 Tasks", type: "assigned"  },
  { label: "💬 Comments", type: "comment" },
  { label: "⚠️ Due",   type: "due"       },
  { label: "✅ Done",  type: "completed" },
];

// ─── Notification Item ────────────────────────────────────────────────────────

const NotifItem = ({
  notif,
  onRead,
}: {
  notif: Notification;
  onRead: (id: string) => void;
}) => (
  <div
    onClick={() => onRead(notif.id)}
    style={{
      display: "flex", gap: 10, padding: "12px 16px", cursor: "pointer",
      background: notif.read ? "#fff" : "linear-gradient(135deg,#fafaff,#fff8fd)",
      borderBottom: "1px solid rgba(108,92,231,0.05)",
      transition: "background .15s", position: "relative",
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#f8f6ff"; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = notif.read ? "#fff" : "linear-gradient(135deg,#fafaff,#fff8fd)"; }}
  >
    {/* Unread dot */}
    {!notif.read && (
      <div style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#6c5ce7,#e84393)" }} />
    )}

    {/* Icon or user avatar */}
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: notif.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
        {notif.icon}
      </div>
      {notif.user && (
        <div style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18, borderRadius: "50%", background: notif.user.bg, color: notif.user.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, border: "2px solid #fff" }}>
          {notif.user.initials}
        </div>
      )}
    </div>

    {/* Content */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, fontWeight: notif.read ? 400 : 600, color: "#0a0814", marginBottom: 2, lineHeight: 1.3 }}>
        {notif.title}
      </div>
      <div style={{ fontSize: 11, color: "#6b6b8a", fontWeight: 300, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {notif.body}
      </div>
      <div style={{ fontSize: 10, color: "#bbb", marginTop: 4 }}>{notif.time}</div>
    </div>
  </div>
);

// ─── Bell Button + Dropdown ───────────────────────────────────────────────────

export default function NotificationsDropdown() {
  const [notifs, setNotifs]       = useState<Notification[]>(INITIAL_NOTIFS);
  const [open, setOpen]           = useState(false);
  const [filter, setFilter]       = useState<NotifType | "all">("all");
  const dropdownRef               = useRef<HTMLDivElement>(null);

  const unreadCount  = notifs.filter((n) => !n.read).length;
  const filtered     = filter === "all" ? notifs : notifs.filter((n) => n.type === filter);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifs([]);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>

      {/* ── Bell button ───────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative", width: 38, height: 38, borderRadius: 10,
          border: open ? "1.5px solid rgba(108,92,231,0.3)" : "1.5px solid rgba(108,92,231,0.12)",
          background: open ? "#f0eeff" : "#fff",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, transition: "all .2s",
          boxShadow: open ? "0 4px 14px rgba(108,92,231,0.15)" : "none",
        }}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <div style={{
            position: "absolute", top: -4, right: -4,
            width: 18, height: 18, borderRadius: "50%",
            background: "linear-gradient(135deg,#e84393,#6c5ce7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 800, color: "#fff",
            border: "2px solid #fff",
            animation: "pulse 2s infinite",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* ── Dropdown ──────────────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: 380, maxHeight: 520,
          background: "#fff", borderRadius: 18,
          boxShadow: "0 20px 60px rgba(108,92,231,0.18), 0 4px 20px rgba(0,0,0,0.08)",
          border: "1.5px solid rgba(108,92,231,0.1)",
          zIndex: 1000, overflow: "hidden",
          animation: "dropIn .2s ease",
        }}>

          {/* Header */}
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(108,92,231,0.07)", background: "linear-gradient(135deg,#fafaff,#fff8fd)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: "#0a0814" }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: "linear-gradient(135deg,#6c5ce7,#e84393)", color: "#fff", padding: "2px 8px", borderRadius: 100 }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: 11, color: "#6c5ce7", fontWeight: 600, background: "#f0eeff", border: "none", borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Mark all read
                  </button>
                )}
                <button onClick={clearAll} style={{ fontSize: 11, color: "#aaa", background: "#f5f5f5", border: "none", borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Clear all
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.type}
                  onClick={() => setFilter(f.type)}
                  style={{
                    padding: "4px 11px", borderRadius: 100, fontSize: 11, fontWeight: 500,
                    cursor: "pointer", border: "1.5px solid", fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap", transition: "all .15s",
                    background: filter === f.type ? "linear-gradient(135deg,#6c5ce7,#e84393)" : "#fff",
                    color: filter === f.type ? "#fff" : "#6b6b8a",
                    borderColor: filter === f.type ? "transparent" : "rgba(108,92,231,0.12)",
                  }}
                >{f.label}</button>
              ))}
            </div>
          </div>

          {/* Notification list */}
          <div style={{ overflowY: "auto", maxHeight: 380 }}>
            {filtered.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem", gap: 8 }}>
                <div style={{ fontSize: 36 }}>🔕</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#6c5ce7" }}>All caught up!</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>No notifications here</div>
              </div>
            ) : (
              filtered.map((notif) => (
                <NotifItem key={notif.id} notif={notif} onRead={markRead} />
              ))
            )}
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(108,92,231,0.06)", background: "#fafbff", display: "flex", justifyContent: "center" }}>
              <button style={{ fontSize: 12, color: "#6c5ce7", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
