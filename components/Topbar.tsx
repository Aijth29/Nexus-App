"use client";

import NotificationsDropdown from "@/components/NotificationsDropdown";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid rgba(108,92,231,0.08)",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Left — title */}
      <div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 20,
          fontWeight: 800,
          background: "linear-gradient(135deg,#6c5ce7,#e84393)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>{subtitle}</div>
        )}
      </div>

      {/* Right — actions + bell */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {actions}
        <NotificationsDropdown />
      </div>
    </div>
  );
}
